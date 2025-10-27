import Link from "next/link";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  GlobeIcon,
  FacebookIcon,
  InstagramIcon,
  Youtube,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MainContactUs } from "@/components/custom/MainContactUsFields";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Get in Touch with <span className="text-blue-200">Kredz</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            We're here to assist you on your journey to better credit and a
            stronger financial future.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {/* <Card className="bg-white border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PhoneIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
              <p className="text-sm text-gray-600">+91 77240 34238</p>
            </CardContent>
          </Card> */}

          <Card className="bg-white border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MailIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
              <p className="text-sm text-gray-600">support@kredz.in</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
              <p className="text-sm text-gray-600">+91 8068213011</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
              <p className="text-sm text-gray-600">Mon-Fri 9AM-6PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-blue-100 bg-white">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Schedule a Free Consultation
                  </h2>
                  <p className="text-gray-600">
                    Ready to take the next step toward better credit? Fill out
                    the form below and our team will get back to you within 24
                    hours.
                  </p>
                </div>
                <MainContactUs />
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>
                      We value your privacy and ensure that all information
                      shared with us is kept confidential and secure.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="shadow-lg border-blue-100 bg-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    {/* <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <PhoneIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Phone</p>
                      <p className="text-sm text-gray-600">+91 77240 34238</p>
                      <p className="text-sm text-gray-600">+91 81209 50068</p>
                    </div> */}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <WhatsappIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        WhatsApp
                      </p>
                      <Link
                        href="https://wa.me/918068213011"
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        +91 8068213011
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MailIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Email</p>
                      <p className="text-sm text-gray-600">support@kredz.in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Address
                      </p>
                      <p className="text-sm text-gray-600">
                        No 656A, ElcotSez, Zsurvey
                      </p>
                      <p className="text-sm text-gray-600">
                        Behind Accenture Company
                      </p>
                      <p className="text-sm text-gray-600">
                        Sholinganallur - 600119
                      </p>
                      <p className="text-sm text-gray-600">Tamil Nadu, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GlobeIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Website
                      </p>
                      <Link
                        href="https://kredz.in"
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        https://kredz.in
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Kredz */}
            <Card className="shadow-lg border-blue-100 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">About Kredz</h3>
                <p className="text-sm text-blue-50 leading-relaxed">
                  At Kredz, we combine expert loan consulting, innovative
                  credit-building services, and strategic partnerships to help
                  you achieve your financial goals.
                </p>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-lg border-blue-100 bg-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Follow Us
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Stay connected with us on social media
                </p>
                <div className="flex gap-3">
                  <Link
                    href="https://www.facebook.com/share/187jupHMLF/"
                    className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                  >
                    <FacebookIcon className="w-5 h-5 text-blue-600" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/kredz.in?igsh=MTdnYTIwd2IyOG5zdQ=="
                    className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                  >
                    <InstagramIcon className="w-5 h-5 text-blue-600" />
                  </Link>
                  <Link
                    href="https://youtube.com/@kredzcredit?si=wM5z5v5unh4xxHUg"
                    className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                  >
                    <Youtube className="w-5 h-5 text-blue-600" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

function WhatsappIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
      viewBox="0 0 48 48"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 29.079097 3.1186875 32.88588 4.984375 36.208984 L 2.0371094 46.730469 A 1.0001 1.0001 0 0 0 3.2402344 47.970703 L 14.210938 45.251953 C 17.434629 46.972929 21.092591 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 21.278025 46 17.792121 45.029635 14.761719 43.333984 A 1.0001 1.0001 0 0 0 14.033203 43.236328 L 4.4257812 45.617188 L 7.0019531 36.425781 A 1.0001 1.0001 0 0 0 6.9023438 35.646484 C 5.0606869 32.523592 4 28.890107 4 25 C 4 13.390466 13.390466 4 25 4 z M 16.642578 13 C 16.001539 13 15.086045 13.23849 14.333984 14.048828 C 13.882268 14.535548 12 16.369511 12 19.59375 C 12 22.955271 14.331391 25.855848 14.613281 26.228516 L 14.615234 26.228516 L 14.615234 26.230469 C 14.588494 26.195329 14.973031 26.752191 15.486328 27.419922 C 15.999626 28.087653 16.717405 28.96464 17.619141 29.914062 C 19.422612 31.812909 21.958282 34.007419 25.105469 35.349609 C 26.554789 35.966779 27.698179 36.339417 28.564453 36.611328 C 30.169845 37.115426 31.632073 37.038799 32.730469 36.876953 C 33.55263 36.755876 34.456878 36.361114 35.351562 35.794922 C 36.246248 35.22873 37.12309 34.524722 37.509766 33.455078 C 37.786772 32.688244 37.927591 31.979598 37.978516 31.396484 C 38.003976 31.104927 38.007211 30.847602 37.988281 30.609375 C 37.969311 30.371148 37.989581 30.188664 37.767578 29.824219 C 37.302009 29.059804 36.774753 29.039853 36.224609 28.767578 C 35.918939 28.616297 35.048661 28.191329 34.175781 27.775391 C 33.303883 27.35992 32.54892 26.991953 32.083984 26.826172 C 31.790239 26.720488 31.431556 26.568352 30.914062 26.626953 C 30.396569 26.685553 29.88546 27.058933 29.587891 27.5 C 29.305837 27.918069 28.170387 29.258349 27.824219 29.652344 C 27.819619 29.649544 27.849659 29.663383 27.712891 29.595703 C 27.284761 29.383815 26.761157 29.203652 25.986328 28.794922 C 25.2115 28.386192 24.242255 27.782635 23.181641 26.847656 C 22.120026 25.912677 20.964341 24.664474 20.130859 23.197266 C 20.064639 23.096266 19.962689 22.942169 19.828125 22.742188 C 19.360194 22.011688 19.086045 21.425879 19.011719 21.068359 C 18.912419 20.557859 19.028073 20.044643 19.291016 19.578125 C 19.548499 19.122625 19.968588 18.729328 20.388672 18.333984 C 20.603714 18.136314 20.818756 17.938644 21.021484 17.734375 C 21.426942 17.325875 21.793456 16.900759 21.972656 16.384766 C 22.147856 15.874766 22.147856 15.320641 21.972656 14.806641 C 21.796456 14.292641 20.983 12.434 20.652344 11.648438 C 20.318344 10.858438 19.985641 10.779297 19.556641 10.779297 C 19.323641 10.779297 19.080578 10.779297 18.642578 10.779297 C 18.202578 10.779297 17.152578 10.990234 16.642578 11.490234 z" />
    </svg>
  );
}
