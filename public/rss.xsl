<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom"
>
  <xsl:output method="html" doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <html lang="{rss/channel/language}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title><xsl:value-of select="rss/channel/title" /> RSS Feed</title>
        <style>
          :root {
            --primary: #4f46e5;
            --primary-hover: #4338ca;
            --text: #1f2937;
            --light-text: #6b7280;
            --bg: #ffffff;
            --card-bg: #f9fafb;
            --border: #e5e7eb;
            --radius: 0.5rem;
            --shadow: 0 1px 3px rgba(0,0,0,0.1);
            --transition: all 0.2s ease;
          }
          
          @media (prefers-color-scheme: dark) {
            :root {
              --primary: #818cf8;
              --primary-hover: #6366f1;
              --text: #f3f4f6;
              --light-text: #9ca3af;
              --bg: #111827;
              --card-bg: #1f2937;
              --border: #374151;
              --shadow: 0 1px 3px rgba(0,0,0,0.3);
            }
          }
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                         Helvetica, Arial, sans-serif, "Apple Color Emoji";
            line-height: 1.6;
            color: var(--text);
            background-color: var(--bg);
            padding: 2rem 1rem;
            max-width: 900px;
            margin: 0 auto;
          }
          
          header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border);
          }
          
          h1 {
            color: var(--primary);
            margin-bottom: 0.5rem;
            font-size: 2.5rem;
            font-weight: 700;
          }
          
          .subtitle {
            color: var(--light-text);
            font-size: 1.125rem;
            margin-bottom: 1.5rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .article-list {
            display: grid;
            gap: 2rem;
          }
          
          article {
            background: var(--card-bg);
            border-radius: var(--radius);
            padding: 2rem;
            border: 1px solid var(--border);
            box-shadow: var(--shadow);
            transition: var(--transition);
          }
          
          article:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          
          h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }
          
          h2 a {
            color: inherit;
            text-decoration: none;
            transition: var(--transition);
          }
          
          h2 a:hover {
            color: var(--primary);
          }
          
          .meta {
            display: flex;
            gap: 1.5rem;
            color: var(--light-text);
            font-size: 0.875rem;
            margin-bottom: 1.25rem;
            flex-wrap: wrap;
            align-items: center;
          }
          
          .tags-container {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
            margin-top: 0.5rem;
          }
          
          .tag {
            background: rgba(79, 70, 229, 0.1);
            color: var(--primary);
            padding: 0.375rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            transition: var(--transition);
            display: inline-flex;
            align-items: center;
          }
          
          .tag:hover {
            background: rgba(79, 70, 229, 0.2);
          }
          
          .content {
            margin-top: 1.5rem;
            color: var(--text);
          }
          
          .content p {
            margin-bottom: 1rem;
          }
          
          .content img {
            max-width: 100%;
            height: auto;
            border-radius: var(--radius);
            margin: 1.5rem 0;
            box-shadow: var(--shadow);
          }
          
          .content pre {
            background: rgba(0,0,0,0.05);
            padding: 1rem;
            border-radius: var(--radius);
            overflow-x: auto;
            margin: 1.5rem 0;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 0.875rem;
          }
          
          .content code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 0.875rem;
            background: rgba(0,0,0,0.05);
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
          }
          
          .read-more {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1.5rem;
            color: var(--primary);
            font-weight: 500;
            text-decoration: none;
            transition: var(--transition);
          }
          
          .read-more:hover {
            color: var(--primary-hover);
          }
          
          .read-more svg {
            width: 1em;
            height: 1em;
            transition: var(--transition);
          }
          
          .read-more:hover svg {
            transform: translateX(2px);
          }
          
          @media (max-width: 768px) {
            body {
              padding: 1.5rem 1rem;
            }
            
            h1 {
              font-size: 2rem;
            }
            
            article {
              padding: 1.5rem;
            }
          }
          
          @media (max-width: 480px) {
            .meta {
              gap: 1rem;
              flex-direction: column;
              align-items: flex-start;
            }
            
            article {
              padding: 1.25rem;
            }
          }
        </style>
      </head>
      
      <body>
        <header>
          <h1><xsl:value-of select="rss/channel/title" /></h1>
          <p class="subtitle"><xsl:value-of select="rss/channel/description" /></p>
          <a href="{rss/channel/link}" class="read-more">
            Visit Website
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </a>
        </header>

        <div class="article-list">
          <xsl:for-each select="rss/channel/item">
            <article>
              <h2>
                <a href="{link}">
                  <xsl:value-of select="title" />
                </a>
              </h2>
              
              <div class="meta">
                <time datetime="{pubDate}">
                  <xsl:value-of select="concat(
                    substring(pubDate, 9, 2), ' ',
                    substring(pubDate, 6, 2), ' ',
                    substring(pubDate, 1, 4)
                  )" />
                </time>
                
                <xsl:if test="category">
                  <div class="tags-container">
                    <xsl:for-each select="category">
                      <span class="tag">
                        <xsl:value-of select="." />
                        <!-- 非最后一个标签添加空格 -->
                        <xsl:if test="position() != last()"> </xsl:if>
                      </span>
                    </xsl:for-each>
                  </div>
                </xsl:if>
              </div>
              
              <xsl:if test="description and description != ''">
                <p style="color: var(--light-text); margin-bottom: 1rem;">
                  <xsl:value-of select="description" />
                </p>
              </xsl:if>
              
              <div class="content">
                <xsl:value-of select="content" disable-output-escaping="yes" />
              </div>
              
              <a href="{link}" class="read-more">
                Read full post
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
            </article>
          </xsl:for-each>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
