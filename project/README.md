# Dear Lyrics, what are you hiding ?

## Abstract
The main idea of our project is to look at the dataset containing metadata of
various songs and link them to their lyrics to look for interesting insights.
In fact, we would ultimately like to be able to look for a word, or a list
of words, petentially grouped by themes as well, and visualize the songs that 
contain these words, grouped by genre and shown on a axis with time.

The story we would like to tell is how various musical genre use different
and very specific vocabulary and how this vocabulary evolved throughout history.

Music is something we all enjoy across all cultures of the world. We all have
many ideas about what kind of lyrics or phrases are often used in each genre,
but in this project we would like to see into the details of lyrics of many
songs to find and vizualize interesting insights about them.

## Research questions
What kind of themes are recurring in the different musical genres?
How did these themes and genres evolve?

## Dataset
We will use the Million Songs dataset to obtain metadata about the songs. We
will use the song titles, release date and artist name. With this data, we will
link it with another data source to look for genres and lyrics. We would scrape
some lyrics website for this, such as genius.com or azlyrics.com.
For example, to retrieve the lyrics information about the song Never Gonna Give You Up
by Rick Astley, we can get them from azlyrics.com/lyrics/rickastley/nevergonnagiveyouup.html
The artist and the song name is directly in the dataset we have chosen.
For the genre, we can scrape wikipedia for the song's article. The infobox of the
songs contains the genre information. Otherwise if Wikipedia doesn't have an article for
the song, the dataset directly contains tags of the artists from certain sites such as MusicBrainz.

## A list of internal milestones up until project milestone 2
We'll start by looking at the lyrics website we know and see which of
them would be the easiest to scrape for lyrics given the artist name
and song title.
We will then work on making the link between the songs in our dataset with
out lyric website of choice as well as Wikipedia.
In the end we will have a dataset with the song titles, artists, genre and
lyrics for the 2nd milestone

## Questions for TAa
Do you happen to know about some relevant datasets for this project, perhaps
containing lyrics or genre information about songs?


# Milestone 2


The main dataset that we use is the Million Song dataset.
There is a lot of different information for each song in this one.
i.e. different audio information, about the artist, ranking on different websites etc…

For us, the only important fields are:

- track id
- artist name 
- title
- year

Since we are interested in visualizing themes and words in different genres,
we must find genre information about our tracks.
Fortunatly, the same people that made the Million Song dataset also provide
a dataset containing the genres of the tracks. This dataset however only 
consists of 59'000 songs.
We easily include the genre information, since the songs are assigned the 
same id in both datasets.
We dropthe songs that are not in the genres dataset.

After extracting the fields of interest, and linking the genres, we use 
the ``artist_name`` and ``title`` to find the corresponding lyrics.
We used two additionnal datasets to find lyrics information of our tracks.
These datasets are Song Lyrics and MetroLyrics.
If the lyrics are not found in either of them, we then use a webscrapper to retrieve
them from the genius.com website.

After finding the lyrics from these three sources, we end up with about the half 
of the tracks with genres. (~30'000) 

For more details about how we tackled these challenges, you can view the detailed 
description in our notebook.

The notebook contains also a detailed plan of what we will do for the milestone 3
and up the presentation.

