"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Deepak Sahoo",
    quote:
      "A good credit score has changed my ability to access credit. I now have unsecured cards from Kotak bank. I also got a low interest cost on my auto loan from Mahindra finance.",
    image: "/global/Deepak.jpg",
  },
  {
    name: "Gondesh Reddy",
    quote:
      "A good score is essential today to get a loan. I would like to get to an 800 score and be able to get a 3-5L business loan at cheap rates. I can already get higher loan amounts because of a better score.",
    image: "/global/Gondesh.jpg",
  },
  {
    name: "Sachin Kumar",
    quote:
      "I have a good salary so want to get to 750 score. Want to buy a house/flat by end '24/beginning '25 which will not be possible with a low score.",
    image: "/global/Sachin.jpg",
  },
  {
    name: "Sashibhushan Maharaj",
    quote:
      "Poor score will mean more rejections and even if approved will mean much lower sanctioned amount. I want to get to an 800 score to apply for a business loan of about 1L with a longer tenure of 6-12 mos. This will reduce the burden on my business.",
    image: "/global/Sashibhushan.jpg",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="bg-gradient-to-b from-indigo-100 to-white py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.h2
          className="text-5xl font-bold text-center text-gray-900 mb-12 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          What Our Clients Say
        </motion.h2>
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative z-10"
            >
              <Quote className="w-16 h-16 text-indigo-500 mb-6 absolute -top-8 -left-8 bg-white rounded-full p-3 shadow-lg" />
              <p className="text-xl md:text-2xl text-gray-700 mb-8 italic">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-500 mr-4">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-indigo-600">Satisfied Client</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-16 bg-white rounded-full p-4 shadow-lg hover:bg-indigo-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-8 h-8 text-indigo-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-16 bg-white rounded-full p-4 shadow-lg hover:bg-indigo-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-8 h-8 text-indigo-600" />
          </button>
        </div>
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full mx-2 transition-all duration-300 focus:outline-none ${
                index === currentIndex
                  ? "bg-indigo-600 scale-125"
                  : "bg-gray-300 hover:bg-indigo-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
