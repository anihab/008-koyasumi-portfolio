import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "gatsby";

// Gallery + Lightbox React component
const defaultImages = [
	{ src: "/images/icon.png", title: "Sample 1", description: "Sample description 1" },
	{ src: "/images/icon.png", title: "Sample 2", description: "Sample description 2" },
	{ src: "/images/icon.png", title: "Sample 3", description: "Sample description 3" }
];

const Gallery = ({ images = defaultImages }) => {
	const [open, setOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const lightboxRef = useRef(null);
	const closeBtnRef = useRef(null);
	const startXRef = useRef(0);

	const openAt = useCallback((index) => {
		setCurrentIndex(index);
		setOpen(true);
	}, []);

	const close = useCallback(() => setOpen(false), []);

	const prev = useCallback(() => setCurrentIndex(i => Math.max(0, i - 1)), []);
	const next = useCallback(() => setCurrentIndex(i => Math.min(images.length - 1, i + 1)), [images.length]);

	useEffect(() => {
		function onKey(e) {
			if (!open) return;
			if (e.key === "Escape") close();
			if (e.key === "ArrowLeft") prev();
			if (e.key === "ArrowRight") next();
		}
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, close, prev, next]);

	useEffect(() => {
		if (open && closeBtnRef.current) closeBtnRef.current.focus();
	}, [open]);

	useEffect(() => {
		const lb = lightboxRef.current;
		if (!lb) return;
		function onTouchStart(e) { startXRef.current = e.touches[0].clientX; }
		function onTouchEnd(e) {
			const diff = e.changedTouches[0].clientX - startXRef.current;
			if (diff > 50) prev();
			else if (diff < -50) next();
		}
		lb.addEventListener("touchstart", onTouchStart, { passive: true });
		lb.addEventListener("touchend", onTouchEnd, { passive: true });
		return () => {
			lb.removeEventListener("touchstart", onTouchStart);
			lb.removeEventListener("touchend", onTouchEnd);
		};
	}, [prev, next]);

	if (!images || images.length === 0) return null;

	return (
		<>
			<div id="gallery" className="gallery">
				<div className="grid">
					{images.map((img, i) => (
						<div
							key={i}
							className="item"
							role="button"
							tabIndex={0}
							data-title={img.title}
							data-description={img.description}
							onClick={() => openAt(i)}
							onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openAt(i); }}
						>
							<img src={img.src} alt={img.title || `Image ${i + 1}`} />
							<div className="overlay">{img.title}</div>
						</div>
					))}
				</div>
			</div>

			<div
				id="lightbox"
				ref={lightboxRef}
				className={`lightbox ${open ? "active" : ""}`}
				role="dialog"
				aria-modal="true"
				aria-label={images[currentIndex]?.title || "Image preview"}
				onClick={(e) => { if (e.target === lightboxRef.current) close(); }}
			>
				<div className="lightbox-content">
					<img
						id="lightbox-img"
						src={images[currentIndex].src}
						alt={images[currentIndex].title || `Image ${currentIndex + 1}`}
					/>
					<div className="lightbox-info">
						<h3 id="lightbox-title">{images[currentIndex].title}</h3>
						<p id="lightbox-desc">{images[currentIndex].description}</p>
					</div>
				</div>

				<button
					id="prev"
					className="lightbox-nav prev"
					onClick={prev}
					style={{ display: currentIndex === 0 ? "none" : "flex" }}
					aria-label="Previous image"
				>
					‹
				</button>

				<button
					id="next"
					className="lightbox-nav next"
					onClick={next}
					style={{ display: currentIndex === images.length - 1 ? "none" : "flex" }}
					aria-label="Next image"
				>
					›
				</button>

				<button
					id="close"
					ref={closeBtnRef}
					className="lightbox-close"
					onClick={close}
					aria-label="Close lightbox"
				>
					×
				</button>
			</div>
		</>
	);
};

export default Gallery;