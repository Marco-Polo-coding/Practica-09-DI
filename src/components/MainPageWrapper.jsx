// src/components/MainPageWrapper.jsx
import { useState } from "react";
import Header from "./Header";
import HeroCarousel from "./HeroCarousel";
import FirebaseCourses from "./FirebaseCourses";
import FloatingCartButton from "./FloatingCartButton";
import CartDialog from "./CartDialog";

const MainPageWrapper = () => {
  const [showCartDialog, setShowCartDialog] = useState(false);

  const handleCartClick = () => {
    setShowCartDialog(true);
  };

  const handleCloseCartDialog = () => {
    setShowCartDialog(false);
  };

  return (
    <>
      {/* Hidratar componentes explícitamente */}
      <Header client:load />
      <HeroCarousel client:load />
      <FirebaseCourses client:load />
      <FloatingCartButton client:load onCartClick={handleCartClick} />
      {showCartDialog && <CartDialog client:load onClose={handleCloseCartDialog} />}
    </>
  );
};

export default MainPageWrapper;
