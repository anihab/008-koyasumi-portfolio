import React, { useState, useEffect, useRef, useCallback } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

// Gallery + Lightbox that loads images from Gatsby File nodes
const Gallery = () => {
		const data = useStaticQuery(graphql`
			query GalleryImagesWithMeta {
				allFile(filter: { extension: { regex: "/(jpg|jpeg|png|gif|webp)/" }, relativeDirectory: { regex: "/illustrations/" } }) {
					nodes {
						id
						name
						relativeDirectory
						publicURL
						childImageSharp {
							gatsbyImageData(width: 600, placeholder: BLURRED, formats: [AUTO, WEBP])
						}
					}
				}
						allMarkdownRemark {
							nodes {
								id
								fileAbsolutePath
								frontmatter {
									title
									image
									alt
									description
								}
							}
						}
			}
		`);

		const files = data?.allFile?.nodes || [];
			const allMd = data?.allMarkdownRemark?.nodes || [];
			const entries = allMd.filter((n) => (n.fileAbsolutePath || "").includes("/content/illustrations/"));

		// build lookup by filename for fast matching
		const fileByName = {};
		files.forEach((f) => {
			const parts = (f.publicURL || "").split("/");
			const basename = parts[parts.length - 1];
			fileByName[basename] = f;
			fileByName[f.name] = f; // also map by name without extension
		});

		// map markdown entries to images, preserving order of entries
		const images = entries
			.map((md) => {
				const imgPath = md.frontmatter?.image || "";
				const imgName = imgPath.split("/").pop();
				const file = fileByName[imgName] || fileByName[imgName.replace(/\?.*$/, "")];
				return {
					id: md.id,
					title: md.frontmatter?.title || imgName || "",
					alt: md.frontmatter?.alt || md.frontmatter?.title || "",
					desc: md.frontmatter?.description || "",
					thumb: file?.childImageSharp ? getImage(file.childImageSharp.gatsbyImageData) : null,
					full: file?.publicURL || imgPath || null,
				};
			})
			.filter(Boolean);

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
	const prev = useCallback(() => setCurrentIndex((i) => Math.max(0, i - 1)), []);
	const next = useCallback(() => setCurrentIndex((i) => Math.min(images.length - 1, i + 1)), [images.length]);

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
		function onTouchStart(e) {
			startXRef.current = e.touches[0].clientX;
		}
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
							key={img.id}
							className="item"
							role="button"
							tabIndex={0}
							data-title={img.title}
							onClick={() => openAt(i)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") openAt(i);
							}}
						>
							{img.thumb ? (
								<GatsbyImage image={img.thumb} alt={img.title || `Image ${i + 1}`} />
							) : (
								<img src={img.full} alt={img.title || `Image ${i + 1}`} />
							)}
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
				onClick={(e) => {
					if (e.target === lightboxRef.current) close();
				}}
			>
				<div className="lightbox-content">
					{images[currentIndex]?.full ? (
						<img id="lightbox-img" src={images[currentIndex].full} alt={images[currentIndex].title || `Image ${currentIndex + 1}`} />
					) : (
						images[currentIndex]?.thumb && <GatsbyImage image={images[currentIndex].thumb} alt={images[currentIndex].title} />
					)}
					<div className="lightbox-info">
						<h3 id="lightbox-title">{images[currentIndex].title}</h3>
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

				<button id="close" ref={closeBtnRef} className="lightbox-close" onClick={close} aria-label="Close lightbox">
					×
				</button>
			</div>
		</>
	);
};

export default Gallery;