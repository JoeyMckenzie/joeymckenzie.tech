// Same formula as the old site's App\Support\ReadingTime: 200 wpm, rounded up,
// never below one. Counts alphabetic runs rather than whitespace-delimited
// tokens -- the PHP version used str_word_count, which counts UTF-8 bytes and so
// inflated posts containing box-drawing characters in terminal output.
export function countWords(body: string | undefined): number {
    return body?.match(/[A-Za-z'-]+/g)?.length ?? 0
}

export function readingMinutes(words: number): number {
    return Math.max(1, Math.ceil(words / 200))
}
