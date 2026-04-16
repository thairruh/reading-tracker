import AddBook from '@/components/add-book';
import CustomHeader from '@/components/banner';
import ViewBook from '@/components/library-book-info';
import React, { useMemo, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import plusIcon from '../assets/images/plusIcon.png';

const Library = () => {

  const [show, setShow] = useState(false);
  const [book, setBook] = useState([]);

  // Getting the width of the shelves because it depends
  // on the specific device's screen width
  const screenWidth = Dimensions.get('window').width;
  const shelfWidth = screenWidth * 0.92;
  const booksPerShelf = Math.floor(shelfWidth / 27);

  //  +1 to count the plus as an item,
  // so it can move to the next shelf when
  // the current shelf runs out of space
  const totalItems = book.length + 1;

  // Must display at least 4 shelves
  const requiredShelves = Math.ceil(totalItems / booksPerShelf);
  const shelfCount = Math.max(4, requiredShelves);

  // splits the books into chucks for each shelf
  const shelves = useMemo(() => {
  const result = [];
  for (let i = 0; i < shelfCount; i++) {
    const start = i * booksPerShelf;
    const end = start + booksPerShelf;
    result.push(book.slice(start, end));
  }
  return result;
  }, [book, shelfCount, booksPerShelf]);

  // determine in the plus goes on the same shelf or next
  const plusIndex = book.length;
  const plusShelfIndex = Math.floor(plusIndex / booksPerShelf);

  const [selectedBook, setSelectedBook] = useState(null);
  const [viewBook, setViewBook] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <CustomHeader title="Library" showGems={false} />

      {shelves.map((shelfBooks, shelfIndex) => (
        <View key={shelfIndex} style={styles.shelf}>
          <View className="flex-row items-end absolute bottom-0">
            
            {shelfBooks.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setSelectedBook(item);
                  setViewBook(true);
                }}
                style={[
                  styles.book,
                  {
                    backgroundColor: item.color,
                    height: item.height,
                  },
                ]}
              />
            ))}

            {/* Move the + to the next shelf when the current
                shelf runs out of space*/}
            {shelfIndex === plusShelfIndex && (
              <View style={styles.transparentBox}>
                <Pressable onPress={() => setShow(true)}>
                  <Image source={plusIcon} className="mt-1.5"/>
                </Pressable>
              </View>
            )}

          </View>
        </View>
      ))}

      <Modal visible={show} transparent>
        <AddBook setBook={setBook} onClose={() => setShow(false)} />
      </Modal>

      <Modal visible={viewBook} transparent>
        {selectedBook && (
          <ViewBook
            title={selectedBook.title}
            startDate={selectedBook.startDate?.toLocaleDateString()}
            finishDate={selectedBook.finishDate?.toLocaleDateString()}
            status={selectedBook.status}
            rating ={selectedBook.rating}
            onClose={() => {
              setViewBook(false)
              setSelectedBook(null);}}
          />
        )}
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#90613E',
  },

  shelf: {
    width: '92%',
    height: 145,
    alignSelf: 'center',
    backgroundColor: "#785033",
    marginBottom: 30,
    borderWidth:2,
  },

  book: {
    width: 27,
    borderWidth: 1,
  },

  transparentBox: {
    width: 35, 
    height: 35, 
    borderRadius: 4, 
    backgroundColor: "#C8AFAF", 
    opacity: 0.85, 
    alignItems: 'center', 
    marginLeft: 10, 
    marginBottom: 50,
  },


});

export default Library;