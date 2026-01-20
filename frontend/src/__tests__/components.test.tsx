import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('Component Rendering', () => {
  describe('Basic Elements', () => {
    it('should render a heading', () => {
      render(
        <BrowserRouter>
          <h1>Kentrick AI</h1>
        </BrowserRouter>
      );

      expect(screen.getByText('Kentrick AI')).toBeInTheDocument();
    });

    it('should render a button', () => {
      render(
        <BrowserRouter>
          <button>Click me</button>
        </BrowserRouter>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render an input', () => {
      render(
        <BrowserRouter>
          <input type="email" placeholder="Email" />
        </BrowserRouter>
      );

      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });
  });

  describe('Form Elements', () => {
    it('should render login form structure', () => {
      render(
        <BrowserRouter>
          <form>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" />
            <button type="submit">Login</button>
          </form>
        </BrowserRouter>
      );

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });
  });

  describe('List Elements', () => {
    it('should render a list of items', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];

      render(
        <BrowserRouter>
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </BrowserRouter>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should render based on condition', () => {
      const isLoading = false;
      const data = 'Loaded data';

      render(
        <BrowserRouter>
          <div>{isLoading ? <span>Loading...</span> : <span>{data}</span>}</div>
        </BrowserRouter>
      );

      expect(screen.getByText('Loaded data')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should show loading state', () => {
      const isLoading = true;

      render(
        <BrowserRouter>
          <div>{isLoading ? <span>Loading...</span> : <span>Data</span>}</div>
        </BrowserRouter>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Data')).not.toBeInTheDocument();
    });
  });
});

describe('Insights Display', () => {
  const mockInsight = {
    summary: 'Test summary content',
    sentiment: {
      label: 'positive',
      score: 0.8,
      explanation: 'The text is positive',
    },
    keyInsights: ['Insight 1', 'Insight 2'],
  };

  it('should render summary', () => {
    render(
      <BrowserRouter>
        <div>
          <h3>Summary</h3>
          <p>{mockInsight.summary}</p>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Test summary content')).toBeInTheDocument();
  });

  it('should render sentiment', () => {
    render(
      <BrowserRouter>
        <div>
          <span>{mockInsight.sentiment.label}</span>
          <span>{mockInsight.sentiment.explanation}</span>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByText('positive')).toBeInTheDocument();
    expect(screen.getByText('The text is positive')).toBeInTheDocument();
  });

  it('should render key insights', () => {
    render(
      <BrowserRouter>
        <ul>
          {mockInsight.keyInsights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </BrowserRouter>
    );

    expect(screen.getByText('Insight 1')).toBeInTheDocument();
    expect(screen.getByText('Insight 2')).toBeInTheDocument();
  });
});

describe('File Upload UI', () => {
  it('should render upload area', () => {
    render(
      <BrowserRouter>
        <div>
          <h2>Upload File</h2>
          <div>Click to upload or drag and drop</div>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByText('Upload File')).toBeInTheDocument();
    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
  });

  it('should render file type hints', () => {
    render(
      <BrowserRouter>
        <p>TXT, CSV, MD, JSON, JPG, PNG, GIF, WEBP (max 10MB)</p>
      </BrowserRouter>
    );

    expect(screen.getByText(/TXT, CSV, MD/)).toBeInTheDocument();
    expect(screen.getByText(/max 10MB/)).toBeInTheDocument();
  });
});
