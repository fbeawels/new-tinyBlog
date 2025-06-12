import { FileText } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | TinyBlog',
  description: 'Terms and conditions for using TinyBlog',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="space-y-4">
            <p>
              Welcome to TinyBlog! These Terms of Service ("Terms") govern your access to and use of the TinyBlog 
              website and services (collectively, the "Service"). By accessing or using the Service, you agree to 
              be bound by these Terms.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2>1. Accounts</h2>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Promptly notifying us of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2>2. User Content</h2>
            <p>You retain ownership of any content you submit, post, or display on or through the Service ("User Content"). By making any User Content available through the Service, you grant us a non-exclusive, transferable, sublicensable, royalty-free license to use, copy, modify, and distribute your User Content in connection with operating and providing the Service.</p>
            <p>You are responsible for your User Content and the consequences of posting it. By uploading, publishing, or otherwise making available any User Content, you represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You own or have the necessary rights to the User Content</li>
              <li>The User Content does not infringe any third-party rights</li>
              <li>The User Content complies with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2>3. Prohibited Conduct</h2>
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Using the Service for any illegal purpose or in violation of any laws</li>
              <li>Harassing, threatening, or intimidating others</li>
              <li>Uploading or transmitting viruses or any other malicious code</li>
              <li>Collecting information about other users without their consent</li>
              <li>Interfering with or disrupting the Service or servers</li>
              <li>Impersonating any person or entity</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2>4. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of TinyBlog and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
          </section>

          <section className="space-y-4 mt-8">
            <h2>5. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
          </section>

          <section className="space-y-4 mt-8">
            <h2>6. Limitation of Liability</h2>
            <p>In no event shall TinyBlog, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </section>

          <section className="space-y-4 mt-8">
            <h2>7. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page and updating the "Last updated" date.</p>
          </section>

          <section className="space-y-4 mt-8">
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:terms@tinyblog.com" className="text-primary hover:underline">
                terms@tinyblog.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
