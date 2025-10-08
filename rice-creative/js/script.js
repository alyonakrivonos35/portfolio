// Строгий режим
"use strict"

window.addEventListener('load', windowLoad);
const html = document.documentElement;

function windowLoad() {
	document.addEventListener('click', documentActions);
	html.classList.add('loaded');
	sliderPagesInit()
	sliderTestimonialInit()
	scrollActions()
	navigation()
}
function documentActions(e) {
	const type = e.type
	const targetElement = e.target

	if (type === 'click') {
		// Меню-бургер
		if (targetElement.closest('.icon-menu')) {
			html.classList.toggle('menu-open');
			html.classList.toggle('lock');
		}
		if (targetElement.closest('.menu__link') && html.classList.contains('menu-open')) {
			html.classList.remove('menu-open');
			html.classList.remove('lock');
		} else {
			return null;
		}
	}
}

// ============ Number Animation =====================

const time = 1500; // ms
const step = 2;
const statisticsElements = document.querySelectorAll('.statistics__number');

function outNum(num, el) {
	let n = 0;
	let t = Math.round(time / (num / step));
	let interval = setInterval(() => {
		n = n + step;
		if (n === num) {
			clearInterval(interval);
		}
		el.innerHTML = n;
	}, t);
}

for (let element of statisticsElements) {
	let num = parseFloat(element.innerHTML);
	outNum(num, element);
}

//========= Partners scroll ============

const scrollers = document.querySelectorAll(".scroller");

// If a user hasn't opted in for recuded motion, then we add the animation
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
	addAnimation();
}

function addAnimation() {
	scrollers.forEach((scroller) => {
		// add data-animated="true" to every `.scroller` on the page
		scroller.setAttribute("data-animated", true);

		// Make an array from the elements within `.scroller-inner`
		const scrollerInner = scroller.querySelector(".scroller__inner");
		const scrollerContent = Array.from(scrollerInner.children);

		// For each item in the array, clone it
		// add aria-hidden to it
		// add it into the `.scroller-inner`
		scrollerContent.forEach((item) => {
			const duplicatedItem = item.cloneNode(true);
			duplicatedItem.setAttribute("aria-hidden", true);
			scrollerInner.appendChild(duplicatedItem);
		});
	});
}


//========= Pages slider ============
function sliderPagesInit() {
	var swiperPages = new Swiper(".ready-pages__slider", {
		slidesPerView: 1.1,
		spaceBetween: 15,
		freeMode: true,
		// Navigation arrows
		autoHeight: true,
		navigation: {
			prevEl: '.slider-controls__arrow--left',
			nextEl: '.slider-controls__arrow--right',
			disabledClass: 'slider-controls__arrow--disabl',
		},
		breakpoints: {
			479.98: {
				slidesPerView: 1.8,
			},
			767.98: {
				slidesPerView: 2.2,
				spaceBetween: 30,
			},
			991.98: {
				slidesPerView: 2.5,
				spaceBetween: 30,
			},
		},
	});
}

//========= Testimonial slider ============
function sliderTestimonialInit() {
	var swiperTestimonial = new Swiper(".testimonial__slider", {
		slidesPerView: 1.2,
		spaceBetween: 30,
		initialSlide: 1,
		centeredSlides: true,
		sped: 600,
		pagination: {
			el: ".slider-testimonial__pagination",
			clickable: true,
		},
		breakpoints: {
			479.98: {
				slidesPerView: 1.2,
			},
			599.98: {
				slidesPerView: 1.6,
			},
			767.98: {
				slidesPerView: 1.8,
			},
			991.98: {
				slidesPerView: 2,
			},
			1099.98: {
				slidesPerView: 2.4,
			},
		},
	});
}


// Робота зі скролом
function scrollActions() {
	window.addEventListener('scroll', scrollAction)

	function scrollAction() {
		// Робота з шапкою
		const header = document.querySelector('.header');
		header.classList.toggle('header--scroll', (scrollY > 20));
	}

	const options = {
		root: null,
		rootMargin: "0px 0px 0px 0px",
		// Відсоток від розміру об'єкту.
		// При появі якого спрацьовує подія
		// Де 0 це будь яка поява
		// 1 це повна поява об'кта в в'юпорті
		threshold: 0.2,
	}
	const callback = (entries, observer) => {
		entries.forEach(entry => {
			const currentElement = entry.target
			if (entry.isIntersecting) {
				currentElement.classList.add('--animate')
				// console.log('я тебе бачу')
			} else {
				// currentElement.classList.remove('--animate')
				// console.log('я тебе не бачу')
			}
		})
	}
	const observer = new IntersectionObserver(callback, options)

	const animElements = document.querySelectorAll('[class*="--anim"]')
	animElements.forEach(animElement => {
		observer.observe(animElement)
	})
}

// Spoiler
document.addEventListener("DOMContentLoaded", function () {
	const spollers = document.querySelectorAll(".spollers__item");

	// Slide Up
	function slideUp(target, duration = 300) {
		target.style.height = target.scrollHeight + 'px';
		target.offsetHeight; // force reflow
		target.style.transition = `height ${duration}ms ease`;
		target.style.height = 0;
		target.setAttribute('data-collapsed', 'true');

		setTimeout(() => {
			target.style.display = 'none';
			target.style.removeProperty('height');
			target.style.removeProperty('transition');
		}, duration);
	}

	// Slide Down
	function slideDown(target, duration = 300) {
		target.style.removeProperty('display');
		let height = target.scrollHeight + 'px';
		target.style.height = 0;
		target.offsetHeight; // force reflow
		target.style.transition = `height ${duration}ms ease`;
		target.style.height = height;
		target.setAttribute('data-collapsed', 'false');

		setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('transition');
		}, duration);
	}

	function slideToggle(target, duration = 300) {
		if (window.getComputedStyle(target).display === 'none' || target.getAttribute('data-collapsed') === 'true') {
			slideDown(target, duration);
		} else {
			slideUp(target, duration);
		}
	}

	let spollersEnabled = false;

	function enableSpollers() {
		if (spollersEnabled) return;
		spollersEnabled = true;

		spollers.forEach(item => {
			const title = item.querySelector(".spollers__title");
			const body = item.querySelector(".spollers__body");

			body.style.display = 'none';
			body.setAttribute('data-collapsed', 'true');

			if (!title.classList.contains("spoller-init")) {
				title.classList.add("spoller-init");

				title.addEventListener("click", function () {
					spollers.forEach(otherItem => {
						const otherTitle = otherItem.querySelector(".spollers__title");
						const otherBody = otherItem.querySelector(".spollers__body");

						if (otherTitle !== title && otherBody.getAttribute('data-collapsed') === 'false') {
							slideUp(otherBody, 300);
							otherTitle.classList.remove("spoller-active");
							otherBody.setAttribute('data-collapsed', 'true');
						}
					});

					// slideToggle(body, 300);
					// title.classList.toggle("spoller-active");
					const isCollapsed = body.getAttribute('data-collapsed') === 'true';
					if (isCollapsed) {
						slideDown(body, 300);
						body.setAttribute('data-collapsed', 'false');
					} else {
						slideUp(body, 300);
						body.setAttribute('data-collapsed', 'true');
					}
					title.classList.toggle("spoller-active");
				});
			}
		});
	}

	function disableSpollers() {
		if (!spollersEnabled) return;
		spollersEnabled = false;

		spollers.forEach(item => {
			const title = item.querySelector(".spollers__title");
			const body = item.querySelector(".spollers__body");

			body.style.removeProperty('display');
			body.removeAttribute('data-collapsed');

			if (title.classList.contains("spoller-init")) {
				const newTitle = title.cloneNode(true);
				newTitle.classList.remove("spoller-init");
				title.parentNode.replaceChild(newTitle, title);
			}
		});
		spollers = document.querySelectorAll(".spollers__item");
	}

	function checkWindowSize() {
		if (window.innerWidth < 768) {
			enableSpollers();
		} else {
			disableSpollers();
		}
	}

	checkWindowSize();
	window.addEventListener("resize", checkWindowSize);
});

// Navigation

function navigation() {
	const header = document.querySelector('header');
	const lineParent = document.querySelector('[data-line-parent]');
	const lineItems = document.querySelectorAll('[data-line-item]');
	const lineBlocks = document.querySelectorAll('[data-line-block]');

	if (lineParent) {
		lineParent.insertAdjacentHTML(
			'beforeend',
			'<div class="line"></div>'
		);
	}
	const lineStyle = getComputedStyle(document.querySelector('.line'));
	const lineTransition = lineStyle.transition;

	function setValues(target, hide) {
		const line = target.closest('[data-line-parent]').querySelector('.line');
		if (!hide) {
			const width = target.getBoundingClientRect().width;
			const leftItem = target.getBoundingClientRect().left;
			const bottomItem = target.getBoundingClientRect().bottom;
			const leftParent = target.closest('[data-line-parent]').getBoundingClientRect().left;
			const bottomParent = target.closest('[data-line-parent]').getBoundingClientRect().bottom;
			const left = leftItem - leftParent;
			const bottom = bottomParent - bottomItem;
			line.style.width = `${width}px`;
			line.style.bottom = `${bottom}px`;
			line.style.left = `${left}px`;

		} else {
			line.style.width = '0';
		}
	}
	function mouseEnterFunc() {
		setValues(this);
	}
	function mouseLeaveFunc() {
		const lineItemActive = document.querySelector('[data-line-item]._active');
		if (lineItemActive) {
			setValues(lineItemActive);
		} else {
			setValues(this, true);
		}
	}
	function resizeFunc() {
		const lineItemActive = document.querySelector('[data-line-item]._active');
		if (lineItemActive) {
			const line = lineItemActive.closest('[data-line-parent]').querySelector('.line');
			line.style.transition = 'none';
			setValues(lineItemActive);
			setTimeout(function () {
				line.style.transition = lineTransition;
			}, 1);
		}
	}
	function clickFunc(e) {
		if (e.target.closest('[data-line-item]')) {
			e.preventDefault();
			const lineItemValue = e.target.closest('[data-line-item]').getAttribute('data-line-item');
			const headerHeight = header.clientHeight;
			if (lineItemValue) {
				const blockScrollTo = document.querySelector(`[data-line-block="${lineItemValue}"]`);
				const lineItemActive = document.querySelector('[data-line-item]._active');
				lineBlocks.forEach((lineBlock) => {
					observerNavigation.unobserve(lineBlock);
				});
				if (lineItemActive) {
					lineItemActive.classList.remove('_active');
				}
				e.target.closest('[data-line-item]').classList.add('_active');
				if (blockScrollTo) {
					const blockScrollTop = blockScrollTo.getBoundingClientRect().top + pageYOffset - headerHeight;
					window.scrollTo({
						top: blockScrollTop,
						behavior: "smooth"
					});
				}
				setTimeout(function () {
					lineBlocks.forEach((lineBlock) => {
						observerNavigation.observe(lineBlock);
					});
				}, 500);
			}
		}
	}
	document.addEventListener("click", clickFunc);
	window.addEventListener("resize", resizeFunc);
	lineItems.forEach(lineItem => {
		lineItem.addEventListener("mouseenter", mouseEnterFunc);
		lineItem.addEventListener("mouseleave", mouseLeaveFunc);
	});
	const changeLineItem = (entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const blockVisible = entry.target.getAttribute('data-line-block');
				const lineItemVisible = document.querySelector(`[data-line-item="${blockVisible}"]`);
				if (lineItemVisible) {
					lineItemVisible.classList.add('_active');
					setTimeout(function () {
						setValues(lineItemVisible);
					}, 1);
				}
			} else {
				const blockVisible = entry.target.getAttribute('data-line-block');
				const lineItemVisible = document.querySelector(`[data-line-item="${blockVisible}"]`);
				if (lineItemVisible) {
					lineItemVisible.classList.remove('_active');
					setValues(lineItemVisible, true);
				}
			}
		});
	}
	const options = {
		threshold: 0.5
	}
	const observerNavigation = new IntersectionObserver(changeLineItem, options);
	lineBlocks.forEach((lineBlock) => {
		observerNavigation.observe(lineBlock);
	});
}


