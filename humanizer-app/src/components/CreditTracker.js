import React from "react";

export default function CreditTracker({ used, total }) {
  return (
    <div className="credit-tracker">
      Credits used: {used} / {total}
    </div>
  );
}
