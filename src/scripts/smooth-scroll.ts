// Smooth scrolling for in-page links (#work, #about…).
// Done in JS so every browser animates the same way; Safari's native
// `scroll-behavior: smooth` is inconsistent for anchor links.

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let frame = 0;

function stop() {
	cancelAnimationFrame(frame);
}

function scrollToY(targetY: number) {
	stop();

	const startY = window.scrollY;
	const maxY = document.documentElement.scrollHeight - window.innerHeight;
	const endY = Math.max(0, Math.min(targetY, maxY));
	const distance = endY - startY;

	if (reducedMotion.matches || Math.abs(distance) < 2) {
		window.scrollTo(0, endY);
		return;
	}

	// Longer jumps take a little longer, within sensible limits
	const duration = Math.max(350, Math.min(900, Math.abs(distance) * 0.5));
	const startTime = performance.now();

	const step = (now: number) => {
		const progress = Math.min(1, (now - startTime) / duration);
		window.scrollTo(0, startY + distance * easeInOutCubic(progress));

		if (progress < 1) frame = requestAnimationFrame(step);
	};

	frame = requestAnimationFrame(step);
}

document.addEventListener('click', (event) => {
	if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
		return;
	}

	const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
	const hash = link?.getAttribute('href');
	if (!link || !hash || hash === '#') return;

	const target = document.getElementById(decodeURIComponent(hash.slice(1)));
	if (!target) return;

	event.preventDefault();

	const header = document.querySelector<HTMLElement>('.masthead');
	const offset = header?.offsetHeight ?? 0;
	const targetY = target === document.body ? 0 : target.getBoundingClientRect().top + window.scrollY - offset;

	scrollToY(targetY);
	history.pushState(null, '', hash);
});

// Let the visitor take over at any moment
for (const type of ['wheel', 'touchstart', 'keydown']) {
	window.addEventListener(type, stop, { passive: true });
}
