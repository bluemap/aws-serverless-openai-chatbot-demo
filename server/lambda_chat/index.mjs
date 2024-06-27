// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const prompt = body.prompt;
  const params = body.params;
  console.log(params);
  if (prompt === undefined || prompt === "") {
    return {
      statusCode: 400,
      bot: "invalid prompt",
    };
  }
  try {
    const response = await openai.chat.completions.create({
      messages:[{
        content:prompt,
        role:'user',
      }],
      model:params.model_name,
      temperature:params.temperature,
      max_tokens:params.max_tokens,
      top_p:params.top_p,
      frequency_penalty:params.frequency_penalty,
      presence_penalty:params.presence_penalty
    },);
    return {
      statusCode: 200,
      body: JSON.stringify({id:body.id,
        bot:response.data.choices[0].text}),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error || "Something wrong"),
    };
  }
};