import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui_components/ui/accordion";
import { Turnstile } from '@marsidev/react-turnstile';

export default function FAQAccordion({ faqs, faqsCount }) {
    return (
        <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
                <AccordionItem key={index + 1} value={index + 1}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
            ))}
            {/* Contact Form for last question */}
            <AccordionItem key={faqsCount + 1} value={faqsCount + 1}>
                <AccordionTrigger>I have other questions. How can I get in touch?</AccordionTrigger>
                <AccordionContent>
                    <div className="text-sm pb-4">
                        <form className="flex flex-col gap-5 rounded mb-6" id="contact">
                            <div>
                                <p className="uppercase font-medium text-lightGray">Get in touch</p>
                                <h2 className="text-4xl font-bold">Contact Us.</h2>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email" className="mb-2 font-medium">Your Email</label>
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="p-3 rounded focus:outline-none placeholder-shown:border-none invalid:border invalid:border-red-500"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="message" className="mb-2 font-medium">Your Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="3"
                                    placeholder="Type your question here... 😁"
                                    className="p-3 rounded focus:outline-none"
                                    required></textarea>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between">
                                <button
                                    type="submit"
                                    className="text-center px-6 py-3 mb-2 border-2 border-orange rounded hover:bg-orange duration-300"
                                >
                                    Send
                                </button>
                                <Turnstile siteKey={import.meta.env.PROD ? "1x00000000000000000000AA" : "1x00000000000000000000AA"} />
                            </div>
                        </form>
                    </div>
                </AccordionContent>
            </AccordionItem >
        </Accordion >
    )
}