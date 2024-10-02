import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function AboutScreen() {
  const [expanded, setExpanded] = useState(null);

  const handleListItemPress = (index) => {
    if (index === expanded) {
      setExpanded(null);
    } else {
      setExpanded(index);
    }
  };

  const renderListItem = (title, description, index, image) => {
    return (
      <TouchableWithoutFeedback onPress={() => handleListItemPress(index)}>
        <View style={styles.listItemContainer}>
          <TouchableWithoutFeedback onPress={() => handleListItemPress(index)}>
            <View style={styles.listItemTitleContainer}>
              {image && <Image source={image} style={styles.developerImage} />}
              <Text style={styles.listItemTitle}>{title}</Text>
            </View>
          </TouchableWithoutFeedback>
          {expanded === index && (
            <ScrollView>
              <Text style={styles.listItemDescription}>{description}</Text>
            </ScrollView>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderListItem(
        "App Overview ",
        <>
          <Text>
            The Irula app is a mobile dictionary designed to help preserve the
            Irula language, an endangered language spoken by a tribal community
            in southern India. With only a few thousand speakers left, the app
            serves as an essential tool for language revitalization efforts,
            allowing learners to access the language and acquire its vocabulary
            in a convenient and accessible manner.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            The app offers a comprehensive and culturally relevant database of
            the Irula language, providing English and Tamil translations for the
            words, making it useful for a wider audience and promoting
            bilingualism. Additionally, the inclusion of images and high-quality
            audio provides a better user experience and enables users to easily
            learn the pronunciation of the words.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            The app's UI/UX was created after intense research for
            user-friendliness and attractiveness, making it easy to navigate and
            understand. The home screen displays a list of words with images on
            the left to help users who cannot read but can identify through an
            image, along with both language words and definitions in Tamil.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            The dedicated glossary screen lists words in alphabetical order,
            along with an interactive scrollbar that highlights the alphabet as
            the user scrolls through it. The search bar is implemented on both
            the home and glossary screens, with different functionality that
            caters to the user's needs. The optimised search bar with a clear
            button and automatic result display when typing enhances the user
            experience.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            The app's cache memory feature acts as an offline storage view for
            the app to access the API, enabling users to access the app even
            without an internet connection. The app provides a valuable resource
            for researchers and linguists studying the language and can assist
            community members in feeling proud of their language and culture.
          </Text>
        </>,
        0,
        null
      )}
      {renderListItem(
        "About IRULA",
        <>
          <Text>
            Irula is a tribe that primarily inhabits the southern states of
            India such as Tamil Nadu, Kerala, and Karnataka. They have a rich
            cultural heritage, with their own language, customs, and traditions.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            The Irula community has faced significant challenges over the years,
            including economic and social marginalization, loss of traditional
            occupations, and a lack of access to quality education and
            healthcare. These challenges have resulted in a lack of
            opportunities and limited access to resources, making it difficult
            for many members of the community to improve their standard of
            living.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            The Irula community has a vast knowledge of traditional practices
            related to agriculture, animal husbandry, and medicinal plants.
            However, this knowledge has largely remained undocumented and
            unrecognized, and there is a growing concern about the loss of these
            valuable practices.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            Therefore, by targeting the Irula community for our app, we aim to
            help preserve and promote their traditional knowledge and practices,
            while also providing them with access to new opportunities for
            education, healthcare, and economic development. Our app can help
            bridge the gap between the older generation, who possess this
            valuable knowledge, and the younger generation, who may not be
            familiar with these practices.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            Furthermore, creating a mobile app dictionary for the Irula language
            would not only help preserve the language but also provide a
            valuable resource for researchers and linguists studying the
            language. This app would provide a comprehensive and easily
            accessible database of the language, allowing researchers to better
            understand its structure, vocabulary, and usage. Additionally,
            language revitalization efforts can also create a sense of
            linguistic pride among language speakers, helping to combat feelings
            of shame and inferiority about their language and culture. Our app
            can play a vital role in promoting and preserving the cultural
            heritage and identity of the Irula community.
          </Text>
        </>,
        1,
        null
      )}

      {renderListItem(
        "Developers",
        "Meet the team behind this app!",
        2,
        null
        //   require("../assets/ash.jpg")
      )}
      {expanded === 2 && (
        <ScrollView horizontal style={styles.developerListContainer}>
          <View style={styles.developerItemContainer}>
            <Image
              source={require("../assets/Kevin_pic.jpg")}
              style={styles.developerItemPhoto}
            />
            <Text style={styles.developerItemName}>Kevin Jinu</Text>
            <Text style={styles.developerItemTitle}>The Backbone</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Icon
                name="github"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="#999"
                onPress={() => Linking.openURL("https://github.com/kevintjinu")}
              />
              <Icon
                name="linkedin"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="white"
                onPress={() =>
                  Linking.openURL("https://www.linkedin.com/in/kevin-jinu/")
                }
              />
            </View>
          </View>
          <View style={styles.developerItemContainer}>
            <Image
              source={require("../assets/evina.jpg")}
              style={styles.developerItemPhoto}
            />
            <Text style={styles.developerItemName}>Evina Novi T </Text>
            <Text style={styles.developerItemTitle}>The Maestro</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Icon
                name="github"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="#999"
                onPress={() => Linking.openURL("https://github.com/evinatn")}
              />
              <Icon
                name="linkedin"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="white"
                onPress={() =>
                  Linking.openURL(
                    "https://www.linkedin.com/in/evina-novi-thekkudan/"
                  )
                }
              />
            </View>
          </View>
          <View style={styles.developerItemContainer}>
            <Image
              source={require("../assets/ariz.jpg")}
              style={styles.developerItemPhoto}
            />
            <Text style={styles.developerItemName}>Ariz Siddiqui</Text>
            <Text style={styles.developerItemTitle}>Backend Developer</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Icon
                name="github"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="#999"
                onPress={() =>
                  Linking.openURL("https://www.github.com/arizsiddiqui")
                }
              />
              <Icon
                name="linkedin"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="white"
                onPress={() =>
                  Linking.openURL("https://www.linkedin.com/in/arizsiddiqui")
                }
              />
            </View>
          </View>
          <View style={styles.developerItemContainer}>
            <Image
              source={require("../assets/arul_sir.jpg")}
              style={styles.developerItemPhoto}
            />
            <Text style={styles.developerItemName}>Dr. S. Arul Dayanand</Text>
            <Text style={styles.developerItemTitle}>The Brains</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Icon
                name="university"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="#999"
                onPress={() =>
                  Linking.openURL(
                    "https://www.srmist.edu.in/faculty/dr-s-arul-dayanand/"
                  )
                }
              />
              <Icon
                name="linkedin"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="white"
                onPress={() =>
                  Linking.openURL(
                    "https://www.linkedin.com/in/dr-arul-dayanand-061a017/"
                  )
                }
              />
            </View>
          </View>
          <View style={styles.developerItemContainer}>
            <Image
              source={require("../assets/Uma_maam.jpg")}
              style={styles.developerItemPhoto}
            />
            <Text style={styles.developerItemName}>Dr. Uma Devi M</Text>
            <Text style={styles.developerItemTitle}>The Enforcer </Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Icon
                name="university"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="#999"
                onPress={() =>
                  Linking.openURL(
                    "https://www.srmist.edu.in/faculty/dr-m-umadevi/"
                  )
                }
              />
              <Icon
                name="linkedin"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="white"
                onPress={() =>
                  Linking.openURL(
                    "https://www.linkedin.com/in/uma-devi-m?trk=contact-info"
                  )
                }
              />
            </View>
          </View>
        </ScrollView>
      )}

      {renderListItem(
        "Acknowledgment",
        <>
          <Text>
            We would like to express our gratitude to SRM Institute of Science
            and Technology for providing us with the opportunity to pursue our
            education and apply our skills towards a meaningful project.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            We extend our sincere thanks to our guides, Dr. S. Arul Dayanand,
            Assistant Professor, Career Development Centre, and Dr. M. Uma Devi,
            Associate Professor, Department of Computing Technologies, for their
            invaluable guidance and support throughout the project.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            We are grateful to the Forest Department of Tamil Nadu for granting
            us permission to interact with and learn from the Irula community,
            and for facilitating our data collection and fieldwork. Their
            cooperation and support made it possible for us to gain a deeper
            understanding of the community's traditional knowledge and
            practices.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            We would also like to acknowledge the support and assistance
            provided by the staff and students at SRM Institute of Science and
            Technology during our internship work.
          </Text>
          <Text>{"\n\n"}</Text>
          <Text>
            Lastly, we express our heartfelt thanks to our parents, family, and
            friends for their unwavering love, constant support, and
            encouragement throughout our journey.
          </Text>
        </>,
        3,
        null
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#284387",
  },
  listItemContainer: {
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "white",
  },
  listItemTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listItemDescription: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "justify",
  },
  developerListContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  developerItemContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  developerItemPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  developerItemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "white",
  },
  developerItemTitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    maxWidth: 112,
    height: 50,
  },
  developerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
