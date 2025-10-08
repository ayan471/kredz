export function Testimonials() {
  const testimonials = [
    {
      name: "Deepak Sahoo",
      location: "UP, India",
      image: "/global/Deepak.jpg",
      quote:
        "A good credit score has changed my ability to access credit. I now have unsecured cards from Kotak bank. I also got a low interest cost on my auto loan from Mahindra finance.",
    },
    {
      name: "Gondesh Reddy",
      location: "AP, India",
      image: "/global/Gondesh.jpg",
      quote:
        "A good score is essential today to get a loan. I would like to get to an 800 score and be able to get a 3-5L business loan at cheap rates. I can already get higher loan amounts because of a better score.",
    },
    {
      name: "Sachin Kumar",
      location: "Delhi, India",
      image: "/global/Sachin.jpg",
      quote:
        "I have a good salary so want to get to 750 score. Want to buy a house/flat by end '24/beginning '25 which will not be possible with a low score.",
    },
  ];

  return (
    <section id="learn" className="py-14 sm:py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl tracking-tight font-semibold">
            Trusted by borrowers nationwide
          </h2>
          <p className="mt-2 text-slate-600">
            Real stories from people who simplified their finances with Kredz.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-400/40"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-slate-400/10 to-transparent skew-x-[-15deg] translate-x-[-30%] group-hover:translate-x-[220%] transition-transform duration-700" />
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt="Customer"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200 shadow"
                />
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-slate-600">
                    {testimonial.location}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-700">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
