#include <cs50.h>
#include <stdio.h>

bool checksum(long card);
void card_type(long card);
int first_two(long card);
int len(long card);

int main(void)
{
    long card = get_long("Number: ");
    bool check = checksum(card);
    if (check == 1)
    {
        card_type(card);
    }

    else
    {
        printf("INVALID\n");
    }

}

//Checksum returns sum
bool checksum(long card)
{
    int sum = 0;
    bool alternate = false;

    while (card >= 1)
    {
        int last_no = card % 10;
        if (alternate == true)
        {
            if (last_no >= 5)
            {
                sum += ((last_no * 2) % 10) + 1;
            }
            else
            {
                sum += last_no * 2;
            }

        }
        else if (alternate == false)
        {
            sum += last_no;
        }
        card /= 10;
        alternate = !alternate;
    }

    if (sum % 10 == 0)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

//Card Type
void card_type(long card)
{
    //AMEX
    if (len(card) == 15 && (first_two(card) == 34 || first_two(card) == 37))
    {
        printf("AMEX\n");
    }

    //MC
    else if (len(card) == 16 && first_two(card) >= 51 && first_two(card) <= 55)
    {
        printf("MASTERCARD\n");
    }

    //VISA
    else if ((len(card) == 13 || len(card) == 16) && first_two(card) / 10 == 4)
    {
        printf("VISA\n");
    }
    //Invalid
    else
    {
        printf("INVALID\n");
    }
}

//First two digits
int first_two(long card)
{
    while (card >= 100)
    {
        card /= 10 ;
    }
    return card;
}


//Lenght of card
int len(long card)
{
    int length = 0;
    while (card >= 1)
    {
        card /= 10;
        length ++;

    }
    return length;
}