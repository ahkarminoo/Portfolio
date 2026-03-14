"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

type FlipGatewayProps = {
  avatarUrl: string;
  fullName: string;
  role: string;
  children: React.ReactNode;
};

export function FlipGateway({ fullName, role, children }: FlipGatewayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const card = cardRef.current;
    if (!card) return;

    let isRunning = false;
    let animationFrameId: number | null = null;
    let currentTween: gsap.core.Tween | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (revealed || isAnimating || !card || isRunning) return;
      
      isRunning = true;
      
      animationFrameId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        if (currentTween) currentTween.kill();
        
        currentTween = gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.25,
          ease: "power2.out",
          transformPerspective: 1000,
          transformOrigin: "center center",
          willChange: "transform"
        });
        
        isRunning = false;
      });
    };

    const handleMouseLeave = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (currentTween) currentTween.kill();
      
      currentTween = gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.4,
        ease: "power2.out",
        willChange: "transform"
      });
    };

    card.style.willChange = "transform";
    card.addEventListener("mousemove", handleMouseMove, { passive: true });
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (currentTween) currentTween.kill();
      card.style.willChange = "auto";
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [revealed, isAnimating]);

  const handleReveal = useCallback(() => {
    if (revealed || isAnimating || !cardRef.current || !portalRef.current || !contentRef.current) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    setIsAnimating(true);

    const card = cardRef.current;
    const portal = portalRef.current;
    const content = contentRef.current;
    
    const cardRect = card.getBoundingClientRect();
    const portalX = cardRect.left + cardRect.width / 2;
    const portalY = cardRect.top + cardRect.height / 2;

    gsap.set(portal, {
      left: portalX,
      top: portalY,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
      visibility: "hidden"
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setRevealed(true);
        setIsAnimating(false);
      }
    });

    tl
      .to(card, { scale: 1.1, duration: 0.15, ease: "back.out(2)" })
      .to(card, { scale: 0.8, duration: 0.15, ease: "power2.inOut" })
      .to(card, { scale: 0, opacity: 0, duration: 0.2, ease: "power3.in" }, "-=0.05")
      .to(portal, { scale: 1, opacity: 1, visibility: "visible", duration: 0.2, ease: "back.out(1.5)" }, "<")
      .to(portal, { scale: 0.5, duration: 0.15, ease: "power2.inOut" })
      .to(portal, { scale: 15, opacity: 0, duration: 0.3, ease: "power3.in" }, "-=0.15")
      .set(content, { display: "block", opacity: 0 })
      .to(rootRef.current?.querySelector(".gateway-stage") as HTMLElement, { opacity: 0, duration: 0.22, ease: "power2.out" })
      .to(content, { opacity: 1, duration: 0.28, ease: "power2.out" }, "<")
      .add(() => {
        const revealItems = gsap.utils.toArray<HTMLElement>(".reveal-item");
        gsap.fromTo(
          revealItems,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "back.out(1.7)" }
        );
      });

    const fallbackTimeout = setTimeout(() => {
      if (!revealed) {
        setRevealed(true);
        setIsAnimating(false);
        if (contentRef.current) contentRef.current.style.display = "block";
        if (cardRef.current) {
          cardRef.current.style.display = "none";
        }
        if (rootRef.current) {
          const stage = rootRef.current.querySelector('.gateway-stage') as HTMLElement;
          if (stage) stage.style.display = "none";
        }
      }
    }, 3000);

    return () => clearTimeout(fallbackTimeout);
  }, [revealed, isAnimating]);

  return (
    <div ref={rootRef} className="gateway-shell">
      {!revealed && (
        <div className="gateway-stage">
          <div
            ref={cardRef}
            className="profile-card-wrapper"
            onClick={handleReveal}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleReveal()}
          >
            <div className="profile-card-front">
              <div className="profile-avatar-placeholder">
                <span>{getInitials(fullName)}</span>
              </div>
              <h1 className="profile-name">{fullName}</h1>
              <p className="profile-role">{role}</p>
              <span className="profile-hint">Click to enter</span>
            </div>
          </div>
          <div ref={portalRef} className="gateway-portal" />
        </div>
      )}

      <div ref={contentRef} className="gateway-content">
        {children}
      </div>
    </div>
  );
}
