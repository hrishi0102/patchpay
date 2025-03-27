// backend/utils/codeEvaluationService.js
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const evaluateCodeAgainstTestCases = async (code, testCases, language) => {
  try {
    // Format test cases for the prompt
    const formattedTestCases = testCases.map((tc, index) => 
      `Test Case ${index + 1}:
      Description: ${tc.description || 'N/A'}
      Input: ${tc.input}
      Expected Output: ${tc.expectedOutput}`
    ).join('\n\n');

    const prompt = `
    Please evaluate the following code against the provided test cases.
    
    Code (${language || 'Unknown'}):
    \`\`\`
    ${code}
    \`\`\`
    
    Test Cases:
    ${formattedTestCases}
    
    For each test case, determine if the code would produce the expected output.
    Provide an overall score from 0-100 indicating what percentage of test cases the code satisfies.
    Explain your reasoning for each test case evaluation.
    
    Output your response in the following JSON format:
    {
      "testResults": [
        {
          "testCaseIndex": 0,
          "passed": true/false,
          "explanation": "explanation here"
        },
        ...
      ],
      "overallScore": 85,
      "summary": "overall explanation"
    }
    
    Ensure your response is valid JSON. Only provide the JSON with no additional text.
    `;

    // Generate content with Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const responseText = response.text;
    
    // Extract the JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse evaluation results from Gemini');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Code evaluation error:', error);
    throw new Error('Failed to evaluate code against test cases');
  }
};

module.exports = {
  evaluateCodeAgainstTestCases
};