import Link from "next/link";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  GlobeIcon,
  FacebookIcon,
  InstagramIcon,
  Youtube,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MainContactUs from "@/components/custom/MainContactUsFields";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-navy-900 sm:text-5xl md:text-6xl">
            Contact <span className="text-orange-500">Kredz</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-navy-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            We're here to assist you on your journey to better credit and a
            stronger financial future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <Card className="border-orange-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-navy-900 mb-4">
                  Get in Touch
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <PhoneIcon className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium text-navy-800">Phone:</p>
                      <p className="text-navy-700">
                        Call us at: 8240561547 & 6290914689
                      </p>
                      <p className="text-sm text-navy-500">
                        Monday to Friday: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MailIcon className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium text-navy-800">Email:</p>
                      <p className="text-navy-700">
                        General inquiries: support@kredz.in{" "}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium text-navy-800">Address:</p>
                      <p className="text-navy-700">
                        No 656A, ElcotSez, Zsurvey, Behind Accenture Company,
                        Old Mahablipuram Road, RajivGandhi Salai
                      </p>
                      <p className="text-navy-700">
                        Sholinganallur - 600119 TamilNadu, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <GlobeIcon className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium text-navy-800">Website:</p>
                      <p className="text-navy-700">https://kredz.in</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-navy-900 mb-4">
                  About Kredz
                </h2>
                <p className="text-navy-700 mb-4">
                  At Kredz, we combine expert loan consulting, innovative
                  credit-building services, and strategic partnerships to help
                  you achieve your financial goals. We partner with
                  RBI-registered Banks and NBFCs to offer the best loan options
                  and tailored credit improvement strategies.
                </p>
                <p className="text-navy-700">
                  Learn more about our services, view customer testimonials, and
                  stay up-to-date on the latest financial tips on our website.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-navy-900 mb-4">
                  Follow Us
                </h2>
                <p className="mb-4 text-navy-700">
                  Stay connected with us on social media:
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="https://www.facebook.com/share/187jupHMLF/"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <FacebookIcon className="w-6 h-6" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/kredz.in?igsh=MTdnYTIwd2IyOG5zdQ=="
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <InstagramIcon className="w-6 h-6" />
                  </Link>
                  <Link
                    href="https://youtube.com/@kredzcredit?si=wM5z5v5unh4xxHUg"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <Youtube className="w-6 h-6" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-lg border-orange-200">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-navy-900 mb-4">
                  Schedule a Free Consultation
                </h2>
                <p className="text-navy-700 mb-6">
                  Ready to take the next step toward better credit? Contact us
                  today to schedule a free consultation. Our team will assess
                  your situation and provide a personalized plan to help you
                  improve your credit score and explore loan options.
                </p>
                <MainContactUs />
                <p className="text-sm text-navy-500 mt-4">
                  We value your privacy and ensure that all information shared
                  with us is kept confidential.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
