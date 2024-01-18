import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui_components/ui/accordion";

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
                    <div class="text-sm pb-4">
                        <form class="flex flex-col gap-5 rounded mb-6" id="contact">
                            <div>
                                <p class="uppercase font-medium text-lightGray">Get in touch</p>
                                <h2 class="text-4xl font-bold">Contact Us.</h2>
                            </div>
                            <div class="flex flex-col">
                                <label for="email" class="mb-2 font-medium">Your Email</label>
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    class="p-3 rounded focus:outline-none placeholder-shown:border-none invalid:border invalid:border-red-500 text-black"
                                    required
                                />
                            </div>
                            <div class="flex flex-col">
                                <label for="message" class="mb-2 font-medium">Your Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="3"
                                    placeholder="Type your question here... 😁"
                                    class="p-3 rounded focus:outline-none text-black"
                                    required></textarea>
                            </div>

                            <div class="flex justify-between">
                                <button
                                    type="submit"
                                    class="text-center px-6 py-3 my-auto border-2 border-orange disabled:border-[#c79a75] rounded hover:enabled:bg-orange duration-300"
                                >
                                    Send
                                </button>
                                <div
                                    class="cf-turnstile"
                                    data-sitekey={import.meta.env.PROD ? "1x00000000000000000000BB" : "1x00000000000000000000BB"}
                                    data-theme="light"
                                >
                                </div>
                            </div>
                        </form>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}