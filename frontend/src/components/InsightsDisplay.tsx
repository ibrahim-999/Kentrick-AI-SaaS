interface Insight {
  id: string;
  type: string;
  content: {
    summary?: string;
    sentiment?: { label: string; score: number; explanation: string };
    keyInsights?: string[];
    imageDescription?: string;
    objects?: string[];
    themes?: string[];
  };
}

interface InsightsDisplayProps {
  insights: Insight[];
  isLoading: boolean;
}

export default function InsightsDisplay({
  insights,
  isLoading,
}: InsightsDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Click "Analyze with AI" to generate insights for this file
        </p>
      </div>
    );
  }

  const insight = insights[0];
  const content = insight.content;

  const getSentimentColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      {content.summary && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Summary
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{content.summary}</p>
          </div>
        </div>
      )}

      {/* Image Description */}
      {content.imageDescription && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Image Description
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">
              {content.imageDescription}
            </p>
          </div>
        </div>
      )}

      {/* Sentiment */}
      {content.sentiment && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Sentiment Analysis
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getSentimentColor(
                  content.sentiment.label
                )}`}
              >
                {content.sentiment.label}
              </span>
              <span className="text-sm text-gray-500">
                Confidence: {Math.round(content.sentiment.score * 100)}%
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {content.sentiment.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Key Insights */}
      {content.keyInsights && content.keyInsights.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Key Insights
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2">
              {content.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Objects Detected */}
      {content.objects && content.objects.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Objects Detected
          </h3>
          <div className="flex flex-wrap gap-2">
            {content.objects.map((obj, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {obj}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Themes */}
      {content.themes && content.themes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Themes
          </h3>
          <div className="flex flex-wrap gap-2">
            {content.themes.map((theme, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
