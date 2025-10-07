// Строгий режим
"use strict"
window.addEventListener('load', windowLoad);
const html = document.documentElement;

function windowLoad() {
	document.addEventListener('click', documentActions);
	html.classList.add('loaded');
	scrollActions()
	sliderTestimonialInit()
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
		targetElement.closest('.menu__link') && html.classList.contains('menu-open') ? html.classList.remove('menu-open') : null
	}
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

//Swiper
function sliderTestimonialInit() {
	var swiperTestimonial = new Swiper(".slider-testimonial", {
		slidesPerView: 1,
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		pagination: {
			el: ".slider-testimonial__pagination",
			clickable: true,
		},
		breakpoints: {
			599.98: {
				slidesPerView: 2,
				spaceBetween: 30,
			},
			999.98: {
				slidesPerView: 1,
			},
		},
	});

	document.querySelectorAll(".testimonial__avatar").forEach(avatar => {
		avatar.addEventListener("click", () => {
			const index = avatar.dataset.index;
			swiperTestimonial.slideToLoop(index);
		});
	});
}

import "./dynamic_adapt.js";
import "./parallax.js";
