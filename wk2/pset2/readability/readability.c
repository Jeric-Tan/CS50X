#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <math.h>

int count_letters(string text);
int count_words(string text);
int count_sentences(string text);

int main(void)
{
    string text = get_string("Text: ");

    int no_letters = count_letters(text);

    int no_words = count_words(text);
    printf("letters: %i\n", no_letters);

    int no_sentences = count_sentences(text);

    float index = 5.88 * no_letters / no_words - 29.6 * no_sentences / no_words - 15.8;

    int value = round(index);
    if (value < 1)
    {
        printf("Before Grade 1\n");
    }
    else if (value >= 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %i\n", value);
    }
}

int count_letters(string text)
{
    int letters = 0;
    for (int i = 0; i < strlen(text); i++)
    {
        if ('A' <= toupper(text[i]) && toupper(text[i]) <= 'Z')
        {
            letters ++;
        }
    }
    return letters;
}

int count_words(string text)
{
    int words = 1;
    for (int i = 0; i < strlen(text); i++)
    {
        if (text[i] == ' ')
        {
            words ++;
        }
    }
    return words;
}

int count_sentences(string text)
{
    int sentences = 0;
    for (int i = 0; i < strlen(text); i++)
    {
        int letter = text[i];
        if (letter == 33 || letter == 46 || letter == 63)
        {
            sentences ++;
        }
    }
    return sentences;
}