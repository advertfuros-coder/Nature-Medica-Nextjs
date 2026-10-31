import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { articles, getArticle } from '@/data/articles';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://naturemedica.in';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Nature Medica`,
    description: article.description,
    alternates: { canonical: `/learn/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    mainEntityOfPage: `${baseUrl}/learn/${article.slug}`,
    author: { '@type': 'Organization', name: 'Nature Medica' },
    publisher: { '@type': 'Organization', name: 'Nature Medica' },
  };

  const faqSchema = article.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  const more = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#2d4e24] hover:text-[#1e3418] mb-5"
        >
          <FiChevronLeft className="w-3.5 h-3.5" /> All guides
        </Link>

        <span className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#eef5ec] text-[#2d4e24] border border-[#2d4e24]/20">
          {article.category}
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mt-3 mb-2">
          {article.title}
        </h1>
        <p className="text-sm text-gray-600 mb-2">{article.description}</p>
        <p className="inline-flex items-center gap-1 text-xs text-gray-500 mb-8">
          <FiClock className="w-3.5 h-3.5" /> {article.readTime} min read
        </p>

        <div className="space-y-8">
          {article.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight mb-2">{s.heading}</h2>
              {s.body?.map((p, i) => (
                <p key={i} className="text-sm sm:text-[15px] text-gray-700 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="space-y-2">
                  {s.list.map((li, i) => (
                    <li key={i} className="flex gap-2.5 text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#2d4e24] flex-shrink-0" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {article.faqs?.length > 0 && (
          <section className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {article.faqs.map((f) => (
                <div key={f.question} className="bg-[#f4f7f2] rounded-xl border border-gray-100 p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{f.question}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 p-5 rounded-2xl bg-[#2d4e24] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm font-semibold">Ready to try the ritual?</p>
          <Link
            href={article.cta.href}
            className="inline-flex items-center justify-center gap-1 bg-white text-[#2d4e24] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#eef5ec] transition-colors"
          >
            {article.cta.label}
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="mt-6 text-[11px] text-gray-500 leading-relaxed">
          This guide is for general information and is not medical advice. Consult a qualified practitioner before
          starting any supplement, especially if you are pregnant, have a medical condition or take medication.
        </p>

        {more.length > 0 && (
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">Keep reading</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {more.map((a) => (
                <Link
                  key={a.slug}
                  href={`/learn/${a.slug}`}
                  className="p-4 rounded-xl border border-gray-100 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#2d4e24] mb-1">{a.category}</p>
                  <p className="text-sm font-bold text-gray-900">{a.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
