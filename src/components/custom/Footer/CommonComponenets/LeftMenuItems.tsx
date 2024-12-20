import React from "react";
import Link from "next/link";

const LeftMenuItems = () => {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2 text-left font-UrbanistLight tracking-wide">
        <Link href="/" className="flex">
          <li>Home</li>
        </Link>
        <Link href="/about-us" className="flex">
          <li className="flex">About Us</li>
        </Link>

        <Link href="/faq" className="flex">
          <li className="flex">FAQs</li>
        </Link>
        <Link href="/contact" className="flex">
          <li className="flex">Contact</li>
        </Link>
      </ul>
    </div>
  );
};

export default LeftMenuItems;
