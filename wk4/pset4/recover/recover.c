#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

// 1 Byte = 8 bits
typedef uint8_t BYTE;

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        printf("./recover file\n");
        return 1;
    }

    //Open Memory Card
    FILE *file = fopen(argv[1], "r");

    if (file == NULL)
    {
        printf("No such file found\n");
        return 1;
    }


    BYTE buffer[512];
    int counter = 0;
    char *filename = malloc(8 * sizeof(char));
    FILE *img = NULL;


    while (fread(buffer, sizeof(BYTE), 512, file) == 512)
    {

        //Check for JPEG file headers
        if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0)
        {
            //if it is a jpeg file type, write filename 0ii

            sprintf(filename, "%03i.jpg", counter);
            counter++;
            //Write in the file with filename
            if (counter != 1)
            {
                fclose(img);
            }

            img = fopen(filename, "w");
            fwrite(buffer, sizeof(BYTE), 512, img);
        }
        else if (counter > 0)
        {
            fwrite(buffer, sizeof(BYTE), 512, img);
        }
    }
    free(filename);
    fclose(file);
    fclose(img);

    return 0;
}