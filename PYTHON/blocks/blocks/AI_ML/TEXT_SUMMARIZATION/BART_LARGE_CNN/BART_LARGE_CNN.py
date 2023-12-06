from flojoy import flojoy, DataFrame


@flojoy(deps={"transformers": "4.30.2", "torch": "2.0.1", "torchvision": "0.15.2"})
def BART_LARGE_CNN(default: DataFrame) -> DataFrame:
    """Take an input dataframe with multiple rows and a single column, then produce a dataframe with a single "summary_text" column.

    The "summary_text" column contains a summary of the text in the corresponding row of the input dataframe.

    Parameters
    ----------
    default : DataFrame
        The text to summarize.

    Returns
    -------
    DataFrame
        dataframe containing the summary text in the "summary_text" column
    """

    import torch
    from flojoy import snapshot_download
    from transformers import BartTokenizer, BartForConditionalGeneration
    import pandas as pd

    input_df = default.m

    assert (
        len(input_df.columns.tolist()) == 1
    ), "Can only take a single-column dataframe as input"

    # Load the repo from either the local cache or from the web, and get the local path
    local_path = snapshot_download(
        repo_id="facebook/bart-large-cnn", revision="3d22493"
    )

    # Load the pre-trained BART model
    model = BartForConditionalGeneration.from_pretrained(local_path)
    tokenizer = BartTokenizer.from_pretrained(local_path)

    def _chunk_text(text):
        inputs_no_trunc = tokenizer(
            text, max_length=None, return_tensors="pt", truncation=False
        )
        chunks = []
        step = 1024
        # step = tokenizer.model_max_length - 1
        for i in range(0, len(inputs_no_trunc["input_ids"][0]), step):
            chunk = inputs_no_trunc["input_ids"][0][i : i + step]
            chunks.append(torch.unsqueeze(chunk, 0))
        return chunks

    def _summarize_text(text):
        chunks = _chunk_text(text)
        summary_ids = [
            model.generate(
                chunk,
                num_beams=4,
                max_length=1024 // 2,
                early_stopping=True,
            )
            for chunk in chunks
        ]
        summaries = [
            "\n".join(
                [
                    tokenizer.decode(
                        g, skip_special_tokens=True, clean_up_tokenization_spaces=False
                    )
                    for g in id
                ]
            )
            for id in summary_ids
        ]
        return "\n".join(summaries)

    column = input_df.columns[0]

    with torch.inference_mode():
        output_df = pd.DataFrame(
            input_df[column].apply(_summarize_text).rename("summary_text")
        )
    return DataFrame(df=output_df)
