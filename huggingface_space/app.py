"""
HuggingFace Space: nyxus-AI/sentiment-demo
-------------------------------------------------
HOW TO DEPLOY (FREE):
1. Go to https://huggingface.co/spaces
2. Click "New Space"
3. Name it: sentiment-demo
4. SDK: Gradio
5. Create the Space
6. Upload this file as "app.py"
7. The Space will auto-deploy — no cost, no credit card!

Once live, your Space URL will be:
https://huggingface.co/spaces/nyxus-AI/sentiment-demo
"""

import gradio as gr
from transformers import pipeline

# Load a free, lightweight sentiment analysis model
# distilbert-base-uncased-finetuned-sst-2-english is only 67MB
# HuggingFace downloads it once and caches it
classifier = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)


def analyze_sentiment(text: str) -> dict:
    """Analyze sentiment of the input text."""
    if not text or not text.strip():
        return {"error": "Please enter some text to analyze."}

    # Truncate to 512 tokens (model limit)
    text = text[:512]

    results = classifier(text, return_all_scores=True)[0]

    # Format results as label: score dict for Gradio Label output
    scores = {r["label"].capitalize(): float(r["score"]) for r in results}
    return scores


# Define examples
examples = [
    ["This AI project is absolutely amazing and innovative!"],
    ["I'm disappointed with the results, it didn't work as expected."],
    ["The model performance is quite reasonable for the dataset size."],
    ["Building neural networks is both challenging and rewarding."],
    ["The training loss converged but accuracy on validation is poor."],
]

# Custom CSS to match portfolio dark theme
custom_css = """
body {
    background: #030712 !important;
    font-family: 'Inter', sans-serif;
}
.gradio-container {
    background: transparent !important;
    max-width: 720px !important;
    margin: 0 auto !important;
}
.gr-box {
    border: 1px solid rgba(255,255,255,0.1) !important;
    background: rgba(255,255,255,0.05) !important;
    border-radius: 16px !important;
}
.gr-button-primary {
    background: rgba(163,230,53,0.9) !important;
    color: black !important;
    font-weight: 700 !important;
    border-radius: 99px !important;
}
.gr-button-primary:hover {
    background: rgba(163,230,53,1) !important;
}
label {
    color: rgba(255,255,255,0.7) !important;
}
"""

# Build the Gradio interface
with gr.Blocks(
    title="Sentiment Analysis Demo — nyxus-AI",
    css=custom_css,
    theme=gr.themes.Base(
        primary_hue=gr.themes.colors.lime,
        neutral_hue=gr.themes.colors.gray,
    ).set(
        background_fill_primary="#030712",
        background_fill_secondary="#111827",
        border_color_primary="rgba(255,255,255,0.1)",
        color_accent_soft="rgba(163,230,53,0.2)",
    )
) as demo:
    gr.Markdown("""
    ## 🤖 Sentiment Analysis
    **Model:** DistilBERT fine-tuned on SST-2 · **Task:** Binary sentiment classification
    
    Type any text below and the model will predict whether it's **Positive** or **Negative** with confidence scores.
    """)

    with gr.Row():
        with gr.Column(scale=2):
            text_input = gr.Textbox(
                label="Input Text",
                placeholder="Type something... e.g. 'This model accuracy is incredible!'",
                lines=4,
                max_lines=8,
            )
            submit_btn = gr.Button("🔍 Analyze Sentiment", variant="primary")

        with gr.Column(scale=1):
            label_output = gr.Label(
                label="Prediction",
                num_top_classes=2,
            )

    gr.Examples(
        examples=examples,
        inputs=text_input,
        label="Try these examples:",
    )

    submit_btn.click(
        fn=analyze_sentiment,
        inputs=text_input,
        outputs=label_output,
    )
    text_input.submit(
        fn=analyze_sentiment,
        inputs=text_input,
        outputs=label_output,
    )

    gr.Markdown("""
    ---
    Built by [Rohan Mane](https://github.com/nyxus-git) · 
    [HuggingFace](https://huggingface.co/nyxus-AI) · 
    Model: [distilbert-sst2](https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english)
    """)

demo.launch()
