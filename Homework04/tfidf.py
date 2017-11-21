from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn import metrics
import numpy as np



def show_top(number, classifier, vectorizer, categories):
    feature_names = np.asarray(vectorizer.get_feature_names())
    for i , category in enumerate(categories):
        top10 = np.argsort(classifier.coef_[i])[-number:]
        print("%s: %s\n" % (category, " ".join(feature_names[top10])))


newsgroups_train = fetch_20newsgroups(subset='train')
newsgroups_test = fetch_20newsgroups(subset='test')

data = fetch_20newsgroups()
print(len(data.filenames))

print("Without removing headers, footers and quotes:\n")
print("Vectorizer")
vectorizer = TfidfVectorizer()
vectors = vectorizer.fit_transform(newsgroups_train.data)
vectors_test = vectorizer.transform(newsgroups_test.data)

print("Classifier")
clf = MultinomialNB(alpha=.01)
clf.fit(vectors, newsgroups_train.target)
pred = clf.predict(vectors_test)
print("Test score : ", metrics.f1_score(newsgroups_test.target, pred, average='macro'))


#vectors_test = vectorizer.transform(newsgroups_test.data)
#pred = clf.predict(vectors_test)
#metrics.f1_score(pred, newsgroups_test.target, average='macro')
#
#show_top(10, clf, vectorizer, newsgroups_train.target_names)


newsgroups_train = fetch_20newsgroups(subset='train',
                                     remove=('headers', 'footers', 'quotes'))
newsgroups_test = fetch_20newsgroups(subset='test',
                                     remove=('headers', 'footers', 'quotes'))

print("With remove of headers, footers and quotes:\n")
print("Vectorizer")
vectorizer = TfidfVectorizer()
vectors = vectorizer.fit_transform(newsgroups_train.data)
vectors_test = vectorizer.transform(newsgroups_test.data)

print("Classifier")
clf = MultinomialNB(alpha=.01)
clf.fit(vectors, newsgroups_train.target)
pred = clf.predict(vectors_test)
print("Test score : ", metrics.f1_score(newsgroups_test.target, pred, average='macro'))

#show_top(20, clf, vectorizer, newsgroups_train.target_names)
