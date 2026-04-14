import AddBook from '@/components/add-book';
import CustomHeader from '@/components/banner';
import React, { useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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

  const shelves = [];

  // splits the books into chucks for each shelf
  for (let i = 0; i < shelfCount; i++) {
    const start = i * booksPerShelf;
    const end = start + booksPerShelf;
    shelves.push(book.slice(start, end));
  }

  // determine in the plus goes on the same shelf or next
  const plusIndex = book.length;
  const plusShelfIndex = Math.floor(plusIndex / booksPerShelf);

  

  return (
    <ScrollView style={styles.container}>
      <CustomHeader title="Library" showGems={false} />

      {shelves.map((shelfBooks, shelfIndex) => (
        <View key={shelfIndex} style={styles.shelf}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', position: 'absolute', bottom: 0 }}>
            
            {shelfBooks.map(item => (
              <View
                key={item.id}
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
                  <Image source={plusIcon} style={{ marginTop: 5}}/>
                </Pressable>
              </View>
            )}

          </View>
        </View>
      ))}

      <Modal visible={show} transparent>
        <AddBook setBook={setBook} onClose={() => setShow(false)} />
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