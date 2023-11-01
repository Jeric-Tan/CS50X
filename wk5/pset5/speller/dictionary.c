// Implements a dictionary's functionality

#include <ctype.h>
#include <stdbool.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <strings.h>
#include "dictionary.h"

// Represents a node in a hash table
typedef struct node
{
    char word[LENGTH + 1];
    struct node *next;
}
node;

// TODO: Choose number of buckets in hash table
const unsigned int N = 26;
unsigned int no_word = 0;
// Hash table
node *table[N];

// Returns true if word is in dictionary, else false
bool check(const char *word)
{
    // TODO

    int index = hash(word);
    node *ptr = table[index];
    while (ptr != NULL){
        if (strcasecmp(ptr->word, word) == 0){
            return true;
        }
        ptr = ptr->next;
    }
    return false;
}



// Hashes word to a number
unsigned int hash(const char *word)
{
    // TODO: Improve this hash function

    return (tolower(word[0]) - 'a');
}

// Loads dictionary into memory, returning true if successful, else false
bool load(const char *dictionary)
{
    // TODO

    FILE *file = fopen(dictionary, "r");
    if (file == NULL)
    {
        return false;
    }
    char word[LENGTH + 1];
    while (fscanf(file, "%s", word) != EOF){

        node *tmp = malloc(sizeof(node));
        if (tmp == NULL){
            return false;
        }
        strcpy(tmp->word, word);

        int index = hash(word);
        if (table[index] == NULL){
            tmp->next = NULL;
        }
        else {
            tmp->next = table[index];
        }
        table[index] = tmp;
        no_word++;
    }
    fclose(file);
    return true;
}

// Returns number of words in dictionary if loaded, else 0 if not yet loaded
unsigned int size(void)
{
    // TODO
    return no_word;

}

// Unloads dictionary from memory, returning true if successful, else false
bool unload(void)
{
    // TODO
    for (int i = 0; i < N; i++){
        node *cursor = table[i];
        while (cursor != NULL){
            node *tmp = cursor;
            cursor = cursor->next;
            free(tmp);
        }
        if (cursor == NULL && (i == N - 1)){
            return true;
        }
    }
    return false;

}
