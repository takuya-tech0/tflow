import openai

client = openai.OpenAI(api_key='OPENAI_API_KEY')

response = client.chat.completions.create(
    model="gpt-4",  # ここをgpt-4に変更
    messages=[
        {"role": "system", "content": "簡単な接続テストを行います。"},
        {"role": "user", "content": "生きてますか？"},
    ]
)

print(response.choices[0].message.content)