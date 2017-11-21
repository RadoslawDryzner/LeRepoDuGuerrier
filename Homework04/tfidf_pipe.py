from __future__ import print_function

from pprint import pprint
from time import time
import logging

from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline


# Load the text
data = fetch_20newsgroups(subset = 'all')


pipeline = Pipeline([
    ('vect', CountVectorizer()),
    ('tfidf', TfidfTransformer()),
    ('clf', SGDClassifier()),
])


parameters = {
    'vect__max_df': (0.5, 0.75, 1.0),
    #'vect__max_features': (None, 5000, 10000, 50000),
    'vect__ngram_range': ((1, 1), (1, 2)),  # unigrams or bigrams
    #'tfidf__use_idf': (True, False),
    #'tfidf__norm': ('l1', 'l2'),
    'clf__alpha': (0.00001, 0.000001),
    'clf__penalty': ('l2', 'elasticnet'),
    #'clf__n_iter': (10, 50, 80),
}


# Found parameters

#Best score: 0.917
#Best parameters set:
#        clf__alpha: 1e-05
#        clf__penalty: 'elasticnet'
#        vect__max_df: 0.5
#        vect__ngram_range: (1, 2)



def split_data(x, y, ratio, seed=1):
    """split the dataset based on the split ratio."""
    # set seed
    np.random.seed(seed)
    # generate random indices
    num_row = len(y)
    indices = np.random.permutation(num_row)
    index_split = int(np.floor(ratio * num_row))
    index_tr = indices[: index_split]
    index_te = indices[index_split:]

if __name__ == "__main__":
    index = data.filenames[0]
    # print(data[index])
    print(data.filenames.shape)
    # print(data[index])

    # multiprocessing requires the fork to happen in a __main__ protected
    # block

    # find the best parameters for both the feature extraction and the
    # classifier
    #grid_search = GridSearchCV(pipeline, parameters, n_jobs=-1, verbose=1)

    #print("Performing grid search...")
    #print("pipeline:", [name for name, _ in pipeline.steps])
    #print("parameters:")
    #pprint(parameters)
    #t0 = time()
    #grid_search.fit(data.data, data.target)
    #print("done in %0.3fs" % (time() - t0))
    #print()

    #print("Best score: %0.3f" % grid_search.best_score_)
    #print("Best parameters set:")
    #best_parameters = grid_search.best_estimator_.get_params()
    #for param_name in sorted(parameters.keys()):
    #    print("\t%s: %r" % (param_name, best_parameters[param_name]))


