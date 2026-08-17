import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { invoiceData } = req.body;
  if (!invoiceData) {
    return res.status(400).json({ error: 'Missing invoiceData' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Agent 1: Negotiation Agent
    const negotiationPrompt = `You are a professional debt collection negotiation agent. 
    Draft an empathetic but firm email requesting payment for the following invoice and offer a 2-part payment plan.
    Invoice Details:
    Client: ${invoiceData.client}
    Amount: $${invoiceData.amount}
    Days Late: ${invoiceData.daysLate}
    Status: ${invoiceData.status}`;

    const negotiationResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: negotiationPrompt,
    });
    
    const draftEmail = negotiationResponse.text;

    // Agent 2: Compliance Agent
    const compliancePrompt = `You are a Compliance Agent evaluating an email against RBI Fair Practices Code.
    Ensure there are no threats, harassment, or abusive language. 
    If the email violates these, rewrite it to be compliant. 
    Otherwise, approve it.
    Return ONLY a valid JSON object with the following schema:
    {
      "approved": boolean,
      "final_message": "string containing the safe email"
    }
    
    Draft Email to Evaluate:
    ${draftEmail}`;

    const complianceResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: compliancePrompt,
    });

    let complianceResultText = complianceResponse.text;
    // Clean up markdown json tags if present
    complianceResultText = complianceResultText.replace(/```json\n?|\n?```/g, '').trim();
    
    const complianceResult = JSON.parse(complianceResultText);
    
    return res.status(200).json(complianceResult);

  } catch (error) {
    console.error('Error in agent execution:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
