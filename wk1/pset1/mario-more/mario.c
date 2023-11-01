#include <cs50.h>
#include <stdio.h>

int main(void)
{
    //Get user input
    int height;
    do
    {
        height = get_int("Height: ");

    }
    while (height <= 0 || height > 8);

    //Height
    for (int i = 1; i <= height; i++)
    {
        //print spaces1
        int no_spaces = (height - i);
        for (int a = 0; a < no_spaces; a++)
        {
            printf(" ");
        }

        //print hex1
        for (int b = 0; b < i; b++)
        {
            printf("#");
        }

        //print gap
        printf("  ");

        //print hex2
        for (int c = 0; c < i; c++)
        {
            printf("#");
        }

        printf("\n");

    }




}