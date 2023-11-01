# TODO


def main():
    text = input("Text: ")

    # number of letters
    letters, words, sent = counting(text)


    index = round(5.88 * letters / words - 29.6 * sent / words - 15.8)
    if index < 1:
        print("Before Grade 1")
    elif index >= 16:
        print("Grade 16+")
    else:
        print(f"Grade {index}")

def counting(text):
    letters = 0
    words = 1
    sent = 0
    for letter in text:
        if letter.isalpha():
            letters += 1
        elif letter.isspace():
            words += 1
        elif letter in ["." , "!" , "?"]:
            sent += 1
        else:
            continue

    return letters, words, sent




if __name__ == "__main__":
    main()