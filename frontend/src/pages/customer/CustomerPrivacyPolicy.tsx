import React from 'react';
import { Mail, MapPin, Building2, ShieldCheck } from 'lucide-react';

export const CustomerPrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full bg-[#050505] text-white min-h-screen selection:bg-[#FF5500] selection:text-white">
      {/* ========================================================================= */}
      {/* HERO BANNER WITH OVERLAPPING FLOATING TITLE CARD (Reference Image Alignment) */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-gradient-to-r from-[#1A0A00] via-[#0D0D0D] to-[#140600] border-b border-white/[0.06] h-[160px] sm:h-[200px] lg:h-[220px] flex items-center justify-center overflow-visible">
        {/* Subtle decorative background pattern / glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,85,0,0.25),rgba(255,255,255,0))]" />
        
        {/* Floating Title Card in Black Theme */}
        <div className="absolute bottom-0 translate-y-1/2 z-20 w-full max-w-[1240px] px-6 sm:px-10 lg:px-16 flex justify-start sm:justify-center lg:justify-start">
          <div className="bg-[#111111] text-white shadow-2xl shadow-black/90 rounded-xl sm:rounded-2xl px-8 sm:px-12 lg:px-16 py-6 sm:py-8 border border-white/[0.12] inline-flex flex-col items-start min-w-[280px] sm:min-w-[360px]">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight leading-none font-hero">
              Privacy Policy
            </h1>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN DOCUMENT CONTAINER (Left-Aligned Clean Legal Layout) */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 pt-20 sm:pt-24 lg:pt-28 pb-20">
        
        {/* Header Metadata & Intro */}
        <div className="mb-10 sm:mb-12 pb-8 border-b border-white/[0.08] text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#FF5500]">
              PATTY PROJECT PRIVACY POLICY
            </span>
            <span className="text-[13px] text-[#71717A] font-medium">
              Last updated: August 2026
            </span>
          </div>

          <p className="text-[15.5px] sm:text-[16.5px] text-[#D4D4D8] leading-[1.8]">
            Patty Project respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how Foody Chefs Ltd, trading as Patty Project, collects, uses, stores and protects personal information when you visit our website, create an account, place an order, use our loyalty programme, contact us or otherwise use our services.
          </p>
        </div>

        {/* Legal Sections (Exact Verbatim Text from Client) */}
        <div className="space-y-10 sm:space-y-12 text-left">

          {/* 1. WHO WE ARE */}
          <section id="section-1" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">1.</span> WHO WE ARE
            </h2>
            <div className="space-y-3.5 text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              <p>
                Patty Project is a food ordering and takeaway brand operated by Foody Chefs Ltd. Where Foody Chefs Ltd determines how and why personal information is processed, it acts as the data controller for the purposes of applicable UK data protection law.
              </p>
              <p>
                Our services may allow customers to browse our menu, place collection or delivery orders, make online payments, create customer accounts, save addresses, view previous orders, earn and redeem Patty Points, and use promotional offers.
              </p>
            </div>
          </section>

          {/* 2. INFORMATION WE COLLECT */}
          <section id="section-2" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">2.</span> INFORMATION WE COLLECT
            </h2>
            <div className="space-y-6 text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              {/* Account information */}
              <div>
                <h3 className="font-bold text-white text-base mb-2.5">
                  Account information
                </h3>
                <ul className="space-y-1.5 pl-5 list-disc marker:text-[#FF5500] text-[#D4D4D8]">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Telephone number</li>
                  <li>Account credentials</li>
                  <li>Saved addresses</li>
                  <li>Account preferences and account creation information</li>
                </ul>
              </div>

              {/* Order information */}
              <div>
                <h3 className="font-bold text-white text-base mb-2.5">
                  Order information
                </h3>
                <ul className="space-y-1.5 pl-5 list-disc marker:text-[#FF5500] text-[#D4D4D8]">
                  <li>Items ordered and customisations</li>
                  <li>Order value, discounts and promotional codes</li>
                  <li>Delivery or collection details</li>
                  <li>Delivery address and instructions</li>
                  <li>Order date, time and status</li>
                  <li>Customer notes</li>
                  <li>Order history</li>
                  <li>Refund and cancellation information</li>
                </ul>
              </div>

              {/* Payment information */}
              <div>
                <h3 className="font-bold text-white text-base mb-2.5">
                  Payment information
                </h3>
                <ul className="space-y-1.5 pl-5 list-disc marker:text-[#FF5500] text-[#D4D4D8] mb-3">
                  <li>Payment method</li>
                  <li>Transaction reference</li>
                  <li>Payment status</li>
                  <li>Amount paid</li>
                  <li>Refund information</li>
                  <li>Limited payment details made available by the payment provider</li>
                </ul>
                <p className="text-[14.5px] text-[#A1A1AA] italic">
                  Complete card details and card security codes should normally be processed securely by the relevant payment service provider rather than stored directly by Patty Project.
                </p>
              </div>
            </div>
          </section>

          {/* 3. PATTY PROJECT LOYALTY PROGRAMME */}
          <section id="section-3" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">3.</span> PATTY PROJECT LOYALTY PROGRAMME
            </h2>
            <div className="space-y-3.5 text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              <p>
                When customers use our loyalty programme, we may process information including Patty Points balance, points earned, redeemed, adjusted or reversed, eligible spend, rewards claimed, bonus points, loyalty offers and related transaction history.
              </p>
              <p>
                Our standard programme awards 1 Patty Point for every eligible 1p spent. The standard reward value is 1,000 points = £1, with redemption beginning from 4,000 points (£4), subject to the current loyalty programme terms.
              </p>
            </div>
          </section>

          {/* 4. HOW WE USE YOUR INFORMATION */}
          <section id="section-4" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">4.</span> HOW WE USE YOUR INFORMATION
            </h2>
            <ul className="space-y-2 pl-5 list-disc marker:text-[#FF5500] text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.7]">
              <li>Create and manage customer accounts</li>
              <li>Process food orders, collection and delivery</li>
              <li>Process and verify payments</li>
              <li>Send order confirmations and service updates</li>
              <li>Process cancellations and refunds</li>
              <li>Maintain order history</li>
              <li>Operate Patty Points and loyalty rewards</li>
              <li>Apply offers and promotional codes</li>
              <li>Provide customer support and handle complaints</li>
              <li>Prevent fraud, misuse and unauthorised activity</li>
              <li>Maintain, secure and improve our website and services</li>
              <li>Maintain financial, tax and business records</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Send marketing communications where legally permitted</li>
            </ul>
          </section>

          {/* 5. LEGAL BASES FOR PROCESSING */}
          <section id="section-5" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">5.</span> LEGAL BASES FOR PROCESSING
            </h2>
            <div className="space-y-3 text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              <p>
                <strong className="text-white font-semibold">Contract:</strong> where processing is necessary to provide an order, payment, collection, delivery, account or loyalty service requested by you.
              </p>
              <p>
                <strong className="text-white font-semibold">Legal obligation:</strong> where we need to process or retain information to comply with applicable legal, tax, accounting or regulatory requirements.
              </p>
              <p>
                <strong className="text-white font-semibold">Legitimate interests:</strong> where reasonably necessary to operate, protect and improve our business and services, provided those interests are not overridden by your rights.
              </p>
              <p>
                <strong className="text-white font-semibold">Consent:</strong> where we ask you to agree to particular processing, such as certain electronic marketing or non-essential cookies where consent is required. You may withdraw consent where applicable.
              </p>
            </div>
          </section>

          {/* 6. MARKETING COMMUNICATIONS */}
          <section id="section-6" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">6.</span> MARKETING COMMUNICATIONS
            </h2>
            <div className="space-y-3 text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              <p>
                We may send information about menu launches, promotions, Patty Points offers, discount codes or other Patty Project news where permitted by law.
              </p>
              <p>
                Marketing preferences should be separate from the ability to create an account or place an order. Customers may unsubscribe using the method provided in a marketing communication or by contacting us.
              </p>
              <p>
                Essential service communications, such as order and payment updates, are not treated in the same way as optional marketing.
              </p>
            </div>
          </section>

          {/* 7. COOKIES AND SIMILAR TECHNOLOGIES */}
          <section id="section-7" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">7.</span> COOKIES AND SIMILAR TECHNOLOGIES
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              Our website may use strictly necessary cookies for functions such as baskets, login and security, as well as analytics, preference or marketing cookies. Where consent is required for non-essential cookies, customers should be given an appropriate choice before those cookies are used. Further information may be provided in a separate Cookie Policy or cookie preference centre.
            </p>
          </section>

          {/* 8. WHO WE MAY SHARE INFORMATION WITH */}
          <section id="section-8" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">8.</span> WHO WE MAY SHARE INFORMATION WITH
            </h2>
            <ul className="space-y-2 pl-5 list-disc marker:text-[#FF5500] text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.7] mb-4">
              <li>Payment service providers</li>
              <li>Website, database and hosting providers</li>
              <li>Delivery providers where applicable</li>
              <li>Email and SMS service providers</li>
              <li>Analytics providers</li>
              <li>IT, security and customer-support providers</li>
              <li>Accountants, professional advisers and service providers</li>
              <li>Government bodies, regulators or law-enforcement authorities where required by law</li>
            </ul>
            <p className="font-semibold text-white text-[15px] sm:text-[16px]">
              We do not sell customer personal information.
            </p>
          </section>

          {/* 9. DELIVERY INFORMATION */}
          <section id="section-9" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">9.</span> DELIVERY INFORMATION
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              For delivery orders, relevant information such as the customer name, address, telephone number, order details and delivery instructions may be shared with the person or service responsible for completing the delivery where necessary.
            </p>
          </section>

          {/* 10. HOW LONG WE KEEP INFORMATION */}
          <section id="section-10" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">10.</span> HOW LONG WE KEEP INFORMATION
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              We keep personal information only for as long as reasonably necessary for the purposes for which it was collected and to meet legal, tax, accounting, fraud-prevention and dispute-resolution requirements. Different categories of information may have different retention periods. Information that is no longer required will be deleted or anonymised where appropriate.
            </p>
          </section>

          {/* 11. ACCOUNT CLOSURE AND DELETION */}
          <section id="section-11" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">11.</span> ACCOUNT CLOSURE AND DELETION
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              Customers may request closure of their Patty Project account. Closing an account does not necessarily mean every record can immediately be deleted. We may retain information relating to orders, payments, refunds, financial records, disputes or fraud prevention where we have a lawful reason or legal requirement to do so.
            </p>
          </section>

          {/* 12. YOUR DATA PROTECTION RIGHTS */}
          <section id="section-12" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">12.</span> YOUR DATA PROTECTION RIGHTS
            </h2>
            <ul className="space-y-2 pl-5 list-disc marker:text-[#FF5500] text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.7] mb-3">
              <li>Request access to personal information we hold about you</li>
              <li>Ask us to correct inaccurate or incomplete information</li>
              <li>Request deletion of information in applicable circumstances</li>
              <li>Request restriction of processing in applicable circumstances</li>
              <li>Object to certain processing</li>
              <li>Request transfer of certain information where applicable</li>
              <li>Withdraw consent where processing relies on consent</li>
              <li>Object to direct marketing</li>
            </ul>
            <p className="text-[14.5px] text-[#A1A1AA] italic">
              These rights are subject to applicable legal conditions and exemptions.
            </p>
          </section>

          {/* 13. SECURITY */}
          <section id="section-13" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">13.</span> SECURITY
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              We use appropriate technical and organisational measures designed to protect personal information. These may include HTTPS, access controls, secure password handling, restricted administrative access, secure payment integrations, system monitoring, backups, authentication controls and security updates. No online system can guarantee absolute security.
            </p>
          </section>

          {/* 14. CHILDREN */}
          <section id="section-14" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">14.</span> CHILDREN
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              Our website and loyalty programme are not intended to knowingly collect personal information from children where parental or guardian consent would be required under applicable law.
            </p>
          </section>

          {/* 15. INTERNATIONAL DATA TRANSFERS */}
          <section id="section-15" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">15.</span> INTERNATIONAL DATA TRANSFERS
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              Some technology or service providers may process information outside the United Kingdom. Where personal information is transferred internationally, appropriate safeguards required by applicable UK data protection law will be used where necessary.
            </p>
          </section>

          {/* 16. CHANGES TO THIS PRIVACY POLICY */}
          <section id="section-16" className="scroll-mt-28">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">16.</span> CHANGES TO THIS PRIVACY POLICY
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8]">
              We may update this Privacy Policy when our services, technology, legal obligations or business operations change. The latest version will be published on the Patty Project website with an updated revision date.
            </p>
          </section>

          {/* 17. CONTACT US */}
          <section id="section-17" className="scroll-mt-28 pt-4">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
              <span className="text-[#FF5500]">17.</span> CONTACT US
            </h2>
            
            <p className="text-[15px] sm:text-[16px] text-[#D4D4D8] leading-[1.8] mb-6">
              If you have questions about this Privacy Policy, wish to exercise your data protection rights, or have concerns about how we handle your personal information, please contact:
            </p>

            {/* Structured Contact Card */}
            <div className="w-full max-w-[760px] p-6 sm:p-8 rounded-xl bg-[#111111] border border-white/[0.10] shadow-xl text-left mb-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.08]">
                <div className="w-9 h-9 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Foody Chefs Ltd</h3>
                  <p className="text-xs text-[#A7A7A7]">Trading as Patty Project</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-[#D4D4D8]">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#FF5500] shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-[#71717A] block font-medium uppercase tracking-wider">Email</span>
                    <a
                      href="mailto:hellofoodychefs@gmail.com"
                      className="text-white hover:text-[#FF5500] font-semibold transition-colors break-all"
                    >
                      hellofoodychefs@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FF5500] shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-[#71717A] block font-medium uppercase tracking-wider">Registered Address</span>
                    <p className="text-white font-medium">
                      124-128 City Road<br />
                      London EC1V 2NX<br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#FF5500] shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-[#71717A] block font-medium uppercase tracking-wider">Brand Information</span>
                    <p className="text-white font-medium">PATTY PROJECT — A Foody Chefs Ltd Brand</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[14px] sm:text-[15px] text-[#A1A1AA] leading-[1.7] italic">
              If you remain dissatisfied with how your personal information has been handled, you may have the right to complain to the Information Commissioner's Office (ICO), the UK's data protection regulator.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default CustomerPrivacyPolicy;
