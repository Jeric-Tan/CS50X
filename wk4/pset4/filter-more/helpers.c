#include "helpers.h"
#include <math.h>

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            float sumColours = image[i][j].rgbtRed + image[i][j].rgbtBlue + image[i][j].rgbtGreen;
            image[i][j].rgbtRed = round((sumColours) / 3);
            image[i][j].rgbtBlue = round((sumColours) / 3);
            image[i][j].rgbtGreen = round((sumColours) / 3);
        }
    }
    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width/2; j++)
        {
            RGBTRIPLE tmp = image[i][j];
            image[i][j] = image[i][width - 1 - j];
            image[i][width - 1- j] = tmp;
        }
    }
    return;
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{
    RGBTRIPLE tempImage[height][width];
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            tempImage[i][j] = image[i][j];
        }
    }

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int sumRed = 0;
            int sumGreen = 0;
            int sumBlue = 0;
            float pixels = 0;
            for (int x = -1; x < 2; x++)
            {
                for (int y = -1; y < 2; y++)
                {
                    int a = i + x;
                    int b = j + y;
                    if (a >= 0 && a < height && b >= 0 && b < width)
                    {
                        sumRed += tempImage[a][b].rgbtRed;
                        sumGreen += tempImage[a][b].rgbtGreen;
                        sumBlue += tempImage[a][b].rgbtBlue;
                        pixels += 1;
                    }
                }
            }
            image[i][j].rgbtRed = round(sumRed / pixels);
            image[i][j].rgbtGreen = round(sumGreen / pixels);
            image[i][j].rgbtBlue = round(sumBlue / pixels);
        }
    }
    return;
}

// Detect edges
void edges(int height, int width, RGBTRIPLE image[height][width])
{
    //tempImage
    RGBTRIPLE tempImage[height][width];
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            tempImage[i][j] = image[i][j];
        }
    }

    //2D array Gx and Gy
    int gX[3][3];
    int gY[3][3];

    gX[0][0] = -1;
    gX[0][1] = 0;
    gX[0][2] = 1;
    gX[1][0] = -2;
    gX[1][1] = 0;
    gX[1][2] = 2;
    gX[2][0] = -1;
    gX[2][1] = 0;
    gX[2][2] = 1;

    gY[0][0] = -1;
    gY[0][1] = -2;
    gY[0][2] = -1;
    gY[1][0] = 0;
    gY[1][1] = 0;
    gY[1][2] = 0;
    gY[2][0] = 1;
    gY[2][1] = 2;
    gY[2][2] = 1;


    //each pixel x= row = col
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            //Initialize Gx variables
            int XsumRed = 0;
            int XsumGreen = 0;
            int XsumBlue = 0;

            //Initialize Gy variables
            int YsumRed = 0;
            int YsumGreen = 0;
            int YsumBlue = 0;


            for (int x = -1; x < 2; x++)
            {
                int a = i + x;
                for (int y = -1; y < 2; y++)
                {
                    int b = j + y;
                    if (a >= 0 && a < height && b >= 0 && b < width)
                    {
                        //Gx
                        XsumRed += (gX[x+1][y+1] * (tempImage[a][b].rgbtRed));
                        XsumGreen += (gX[x+1][y+1] * (tempImage[a][b].rgbtGreen));
                        XsumBlue += (gX[x+1][y+1] * (tempImage[a][b].rgbtBlue));

                        //Gy
                        YsumRed += (gY[x+1][y+1] * (tempImage[a][b].rgbtRed));
                        YsumGreen += (gY[x+1][y+1] * (tempImage[a][b].rgbtGreen));
                        YsumBlue += (gY[x+1][y+1] * (tempImage[a][b].rgbtBlue));
                    }
                }
            }


            //Calculations
            int red = round(sqrt(XsumRed*XsumRed + YsumRed*YsumRed));
            int green = round(sqrt((XsumGreen*XsumGreen) + (YsumGreen*YsumGreen)));
            int blue = round(sqrt((XsumBlue*XsumBlue) + (YsumBlue*YsumBlue)));

            if (red > 255)
            {
                red = 255;
            }

            if (green > 255)
            {
                green = 255;
            }

            if (blue > 255)
            {
                blue = 255;
            }

            image[i][j].rgbtRed = red;
            image[i][j].rgbtGreen = green;
            image[i][j].rgbtBlue = blue;

        }
    }
    return;
}
