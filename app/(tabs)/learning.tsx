import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, useColorScheme, TextInput, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Search, Play, Clock, ChevronRight, Award, Star, Users, Bookmark, Sparkles, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';

export default function LearningScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  
  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'crops', name: 'Crop Management' },
    { id: 'soil', name: 'Soil Health' },
    { id: 'irrigation', name: 'Irrigation' },
    { id: 'digital', name: 'Digital Skills' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'organic', name: 'Organic Farming' },
  ];
  
  // Updated course list with Google links
  const featuredCourses = [
    {
      id: 1,
      title: 'Modern Irrigation Techniques',
      duration: '4h 30m',
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1620877368-ffbeb7327328?q=80&w=400&auto=format&fit=crop',
      rating: 4.8,
      students: 1240,
      category: 'irrigation',
      link: 'https://grow.google/intl/europe/story/agro-u/',
      source: 'Google',
    },
    {
      id: 2,
      title: 'Success Story: Mokgadi Mabela',
      duration: '2h 15m',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?q=80&w=400&auto=format&fit=crop',
      rating: 4.6,
      students: 950,
      category: 'organic',
      link: 'https://grow.google/intl/ssa-en/story/mokgadi-mabela/',
      source: 'Google',
    },
    {
      id: 3,
      title: 'Story: Mateja Treven',
      duration: '3h 20m',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=400&auto=format&fit=crop',
      rating: 4.9,
      students: 1560,
      category: 'organic',
      link: 'https://grow.google/intl/europe/story/mateja-treven/',
      source: 'Google',
    },
  ];
  
  const popularCourses = [
    {
      id: 4,
      title: 'Digital Marketing Fundamentals',
      image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f5a07a?q=80&w=400&auto=format&fit=crop',
      duration: '6h 20m',
      rating: 4.7,
      category: 'digital',
      link: 'https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing',
      source: 'Google',
    },
    {
      id: 5,
      title: 'Cloud Skills Boost: Basics',
      image: 'https://images.unsplash.com/photo-1639322537231-2f206e06af84?q=80&w=400&auto=format&fit=crop',
      duration: '3h 10m',
      rating: 4.5,
      category: 'digital',
      link: 'https://www.cloudskillsboost.google/course_templates/524',
      source: 'Google',
    },
    {
      id: 6,
      title: 'Google Earth Engine Tutorials',
      image: 'https://images.unsplash.com/photo-1542367787-35e33666269f?q=80&w=400&auto=format&fit=crop',
      duration: '4h 40m',
      rating: 4.8,
      category: 'analytics',
      link: 'https://developers.google.com/earth-engine/tutorials',
      source: 'Google',
    },
    {
      id: 7,
      title: 'Google Analytics Academy',
      image: 'https://images.unsplash.com/photo-1572115008733-6561c7d435e1?q=80&w=400&auto=format&fit=crop',
      duration: '5h 30m',
      rating: 4.6,
      category: 'analytics',
      link: 'https://analytics.google.com/analytics/academy/',
      source: 'Google',
    },
    {
      id: 8,
      title: 'Cloud Computing Basics',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop',
      duration: '4h 50m',
      rating: 4.6,
      category: 'digital',
      link: 'https://www.cloudskillsboost.google/course_templates/487',
      source: 'Google',
    },
    {
      id: 9,
      title: 'Advanced Cloud Skills',
      image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=400&auto=format&fit=crop',
      duration: '6h 50m',
      rating: 4.7,
      category: 'digital',
      link: 'https://www.cloudskillsboost.google/course_templates/536',
      source: 'Google',
    },
    {
      id: 10,
      title: 'Sustainable Rice Farming',
      image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?q=80&w=400&auto=format&fit=crop',
      duration: '6h 20m',
      rating: 4.7,
      category: 'crops',
      link: 'https://www.cloudskillsboost.google/course_templates/524',
      source: 'Google',
    }
  ];
  
  const filteredCourses = popularCourses.filter(course => 
    (activeCategory === 'all' || course.category === activeCategory) &&
    (searchQuery === '' || course.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Function to open course link
  const openCourseLink = useCallback(async (url: string) => {
    try {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  }, []);

  // Function to toggle bookmark
  const toggleBookmark = (id: number) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(courseId => courseId !== id));
    } else {
      setBookmarked([...bookmarked, id]);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
          style={styles.headerSection}
        >
          <Text style={styles.headerTitle}>Learning Hub</Text>
          <Text style={styles.headerSubtitle}>Enhance your farming knowledge</Text>
          
          <View style={styles.searchContainer}>
            <Search size={20} color={isDark ? '#BBBBBB' : '#666666'} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#333333' }]}
              placeholder="Search for courses..."
              placeholderTextColor={isDark ? '#888888' : '#999999'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </LinearGradient>
        
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScrollContent}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  activeCategory === category.id && styles.activeCategoryButton,
                  { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === category.id && styles.activeCategoryText,
                    { color: isDark ? '#FFFFFF' : '#333333' }
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Featured Courses
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredCourses.map(course => (
              <TouchableOpacity 
                key={course.id}
                style={[styles.featuredCourseCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
                onPress={() => openCourseLink(course.link)}
              >
                <Image source={{ uri: course.image }} style={styles.featuredCourseImage} />
                <View style={styles.courseOverlay}>
                  <TouchableOpacity style={styles.playButton}>
                    <Play size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                {course.source === 'Google' && (
                  <View style={styles.sourceTag}>
                    <Sparkles size={12} color="#FFFFFF" />
                    <Text style={styles.sourceText}>Google</Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.bookmarkButton}
                  onPress={() => toggleBookmark(course.id)}
                >
                  <Bookmark 
                    size={16} 
                    color="#FFFFFF" 
                    fill={bookmarked.includes(course.id) ? "#38B000" : "transparent"} 
                  />
                </TouchableOpacity>
                <View style={styles.featuredCourseContent}>
                  <Text style={[styles.courseTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {course.title}
                  </Text>
                  
                  <View style={styles.courseInfoRow}>
                    <View style={styles.courseInfo}>
                      <Clock size={14} color="#38B000" />
                      <Text style={[styles.courseInfoText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                        {course.duration}
                      </Text>
                    </View>
                    <View style={styles.courseInfo}>
                      <Award size={14} color="#38B000" />
                      <Text style={[styles.courseInfoText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                        {course.level}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.courseStats}>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFD700" fill="#FFD700" />
                      <Text style={[styles.ratingText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        {course.rating}
                      </Text>
                    </View>
                    <View style={styles.studentsContainer}>
                      <Users size={14} color={isDark ? '#BBBBBB' : '#666666'} />
                      <Text style={[styles.studentsText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                        {course.students} students
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              {activeCategory === 'all' ? 'Google Courses' : `${categories.find(c => c.id === activeCategory)?.name}`}
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.coursesGrid}>
            {filteredCourses.map(course => (
              <TouchableOpacity 
                key={course.id}
                style={[styles.courseCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
                onPress={() => openCourseLink(course.link)}
              >
                <Image source={{ uri: course.image }} style={styles.courseImage} />
                {course.source === 'Google' && (
                  <View style={styles.smallSourceTag}>
                    <Text style={styles.smallSourceText}>Google</Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.smallBookmarkButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleBookmark(course.id);
                  }}
                >
                  <Bookmark 
                    size={14} 
                    color="#FFFFFF" 
                    fill={bookmarked.includes(course.id) ? "#38B000" : "transparent"} 
                  />
                </TouchableOpacity>
                <View style={styles.courseCardContent}>
                  <Text style={[styles.courseCardTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {course.title}
                  </Text>
                  
                  <View style={styles.courseCardInfo}>
                    <View style={styles.courseCardInfoItem}>
                      <Clock size={12} color="#38B000" />
                      <Text style={[styles.courseCardInfoText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                        {course.duration}
                      </Text>
                    </View>
                    <View style={styles.courseCardInfoItem}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={[styles.courseCardInfoText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                        {course.rating}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={[styles.expertSection, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.expertTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Need Expert Advice?
          </Text>
          <Text style={[styles.expertDescription, { color: isDark ? '#BBBBBB' : '#666666' }]}>
            Connect with agricultural experts for personalized guidance on your farming challenges.
          </Text>
          <TouchableOpacity style={styles.expertButton}>
            <Text style={styles.expertButtonText}>Connect with Experts</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#999999' : '#999999' }]}>
            CropGenies and Co v1.0.0
          </Text>
          <Text style={[styles.footerDeveloper, { color: isDark ? '#38B000' : '#38B000' }]}>
            Developed by TOJIN VARKEY SIMSON
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  categoriesContainer: {
    marginVertical: 15,
  },
  categoriesScrollContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeCategoryButton: {
    backgroundColor: '#38B000',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    color: '#38B000',
    fontWeight: '500',
    fontSize: 14,
  },
  featuredCourseCard: {
    width: 280,
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredCourseImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  courseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 176, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  sourceTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(66, 133, 244, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  sourceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  smallSourceTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(66, 133, 244, 0.8)',
    zIndex: 10,
  },
  smallSourceText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  smallBookmarkButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  featuredCourseContent: {
    padding: 15,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseInfoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  courseInfoText: {
    fontSize: 12,
    marginLeft: 5,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  studentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentsText: {
    fontSize: 12,
    marginLeft: 5,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseCard: {
    width: '48%',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  courseImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  courseCardContent: {
    padding: 10,
  },
  courseCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  courseCardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseCardInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseCardInfoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  expertSection: {
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expertDescription: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  expertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38B000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  expertButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 5,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  footerDeveloper: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 