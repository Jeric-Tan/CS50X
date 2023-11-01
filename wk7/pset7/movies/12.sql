
SELECT title FROM stars
JOIN people ON people.id = stars.person_id
JOIN movies ON stars.movie_id = movies.id

WHERE name = "Bradley Cooper" OR name = "Jennifer Lawrence"
GROUP BY movie_id
HAVING COUNT(movie_id) > 1



