'use client';

interface AIOverviewOptimizedProps {
  title: string;
  description: string;
  keyPoints: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export default function AIOverviewOptimized({ title, description, keyPoints, faqs }: AIOverviewOptimizedProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* AI Overview Optimized Content */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">{title}</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">{description}</p>
          
          {/* Key Points for AI Overview */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Key Features:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section for AI Overview */}
          {faqs && faqs.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <h4 className="text-lg font-semibold mb-2 text-gray-900">{faq.question}</h4>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
