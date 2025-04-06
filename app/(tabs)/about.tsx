import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Linking, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, MapPin, Calendar, Linkedin, Github, Award, BookOpen, Code, Briefcase, Cpu, Languages, Bookmark, GraduationCap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const profileInfo = {
    name: 'TOJIN VARKEY SIMSON',
    title: 'Software Developer, AI Solutions Engineer',
    email: 'tojinsimson28@gmail.com',
    phone: ['9742204441', '8891942523'],
    address: 'Flat number 201, Roshan Enclave, Behind Canara Bank Road, Begur, Bengaluru, 560068',
    birthdate: 'April 28th, 2003',
    linkedin: 'linkedin.com/in/tojin-varkey-simson-664650286',
    github: 'github.com/TechieTojin',
    gender: 'Male',
    nationality: 'Indian'
  };

  const skills = {
    soft: [
      'Communication: Clear articulation of ideas and fostering open dialogue',
      'Leadership: Experienced in team management and project leadership',
      'Teamwork: Strong collaboration skills within diverse teams',
      'Time Management: Efficient in task prioritization and meeting deadlines',
      'Critical Thinking: Effective in evaluating situations and decision-making'
    ],
    technical: [
      'Programming: C, Python, R, Java, Node.js, C#',
      'Databases: SQL, MongoDB',
      'Tools: SAS Programming, Microsoft Excel, AWS Cloud',
      'Web Development: HTML, CSS, JavaScript',
      'Version Control: Git, GitHub'
    ]
  };

  const education = [
    {
      institution: 'Christ University',
      degree: 'Master of Computer Applications (MCA)',
      period: '2024 - Present',
      details: [
        'Engaged in advanced coursework to enhance technical and analytical skills in computer applications, preparing for a successful IT and software development career',
        'Actively participating in various projects to apply theoretical knowledge in practical scenarios'
      ]
    },
    {
      institution: 'St. Joseph\'s University',
      degree: 'Bachelor of Science in Statistics-Computer Science (Double Major)',
      period: '2021 - 2024',
      details: [
        'Elected as the class representative. Actively participated in academic and extracurricular activities, strengthening leadership and teamwork skills'
      ]
    },
    {
      institution: 'St. Francis Composite PU College',
      degree: 'Pre-University Course (11th and 12th Grades)',
      period: '2019 - 2021',
      details: [
        'Served as class representative',
        'Engaged in various academic and social initiatives, contributing to a collaborative learning environment'
      ]
    },
    {
      institution: 'Christ School',
      degree: 'Secondary School',
      period: '2013 - 2019',
      details: [
        'Developed foundational skills in various subjects, fostering a strong academic base',
        'Participated in school activities and events'
      ]
    }
  ];

  const projects = [
    {
      title: 'Library Management System',
      description: 'Developed a comprehensive library management system to automate book cataloging, user registration, and borrowing operations. Integrated a chatbot to assist users with inquiries and book search.',
      technologies: 'PHP, HTML, JavaScript, CSS'
    },
    {
      title: 'College Management System',
      description: 'Designed a robust platform to streamline administrative functions, including student and admin logins, feedback forms, and an interactive campus map for enhanced campus navigation.',
      technologies: 'XML, Node.js, HTML, JavaScript'
    },
    {
      title: 'Face Analysis System',
      description: 'Built a Python-based real-time face detection and analysis application, utilizing machine-learning algorithms for precise image processing and recognition.',
      technologies: 'Python, OpenCV'
    },
    {
      title: 'Bus Reservation System',
      description: 'Created a console-based bus reservation system that enables users to book, modify, and track bookings, providing an efficient and user-friendly experience.',
      technologies: 'C'
    },
    {
      title: 'Bank Management System',
      description: 'Developed a Java-based banking application to manage customer accounts and transactions, featuring account creation, deposits, withdrawals, fund transfers, balance inquiries, and transaction history tracking.',
      technologies: 'Java, JDBC'
    }
  ];

  const researchPapers = [
    {
      title: 'A Study on Deep Learning Approaches for Detecting Fake News, Audio & Video',
      description: 'Investigated the application of deep learning methodologies for detecting and mitigating fake news in various formats, including text, audio, and video. The study evaluated the effectiveness of different algorithms in preserving media integrity and enhancing information reliability.'
    },
    {
      title: 'Secure Software Development: Ensuring Security from the Initial Stages',
      description: 'Conducted an in-depth analysis of security practices integrated into the software development lifecycle. Focused on the importance of early-stage threat modeling and secure coding techniques to proactively address vulnerabilities and ensure robust software security.'
    }
  ];

  const awards = [
    'Karate Tournament 2017: Represented Christ School in an inter-school karate competition',
    'Prathibha 2023: Recognized for excellence in Face Painting',
    'Adaptus Statistica: Winner of the Treasure Hunt competition',
    'Prathibha 2022: Honored for participation in Rangeez'
  ];

  const certificates = [
    'SAS Programming',
    'ELIXIR Open Day',
    'DCL IQ National Scholarship',
    'AWS Academy: Introduction to Cloud',
    'Abacus Examination',
    'Artificial Intelligence',
    'Writing for Cinema',
    'ChatGPT for Cybersecurity',
    'Introduction to AI for Metaverse',
    'Fundamentals of Information Security'
  ];

  const interests = [
    'Karate: Green belt, demonstrating discipline',
    'Abacus: 2 years of mental arithmetic practice',
    'Theatre Acting: Participating in theatrical productions',
    'Exploring New Opportunities: Eager to learn and grow personally and professionally',
    'Traveling: Enjoy exploring new cultures and broadening perspectives',
    'Technology: Passionate about staying up-to-date with emerging tech trends'
  ];

  const languages = ['English', 'Malayalam', 'Hindi', 'Kannada', 'Tamil'];

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={[styles.section, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>{title}</Text>
      {children}
    </View>
  );

  const ListItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <View style={styles.listItem}>
      {icon}
      <Text style={[styles.listItemText, { color: isDark ? '#CCCCCC' : '#555555' }]}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={isDark ? ['#0F2027', '#203A43', '#2C5364'] : ['#56CCF2', '#2F80ED']}
          style={styles.header}
        >
          <View style={styles.profileImageContainer}>
            {/* Profile image placeholder */}
            <View style={[styles.profileImagePlaceholder, { backgroundColor: isDark ? '#2C5364' : '#56CCF2' }]}>
              <Text style={styles.profileInitials}>{profileInfo.name.split(' ').map(n => n[0]).join('')}</Text>
            </View>
          </View>
          
          <Text style={styles.name}>{profileInfo.name}</Text>
          <Text style={styles.title}>{profileInfo.title}</Text>
          
          <View style={styles.contactInfo}>
            <TouchableOpacity 
              style={styles.contactItem} 
              onPress={() => Linking.openURL(`mailto:${profileInfo.email}`)}
            >
              <Mail size={16} color="#FFFFFF" />
              <Text style={styles.contactText}>{profileInfo.email}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => Linking.openURL(`tel:${profileInfo.phone[0]}`)}
            >
              <Phone size={16} color="#FFFFFF" />
              <Text style={styles.contactText}>{profileInfo.phone.join(', ')}</Text>
            </TouchableOpacity>
            
            <View style={styles.contactItem}>
              <MapPin size={16} color="#FFFFFF" />
              <Text style={styles.contactText}>{profileInfo.address}</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Calendar size={16} color="#FFFFFF" />
              <Text style={styles.contactText}>{profileInfo.birthdate}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => openLink(`https://${profileInfo.linkedin}`)}
            >
              <Linkedin size={16} color="#FFFFFF" />
              <Text style={styles.contactText}>{profileInfo.linkedin}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => openLink(`https://${profileInfo.github}`)}
            >
              <Github size={16} color="#FFFFFF" />
              <Text style={styles.contactText}>{profileInfo.github}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        <Section title="Profile">
          <Text style={[styles.paragraphText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
            I'm Tojin Varkey Simson, a driven and curious individual passionate about technology and problem-solving. 
            I thrive on challenges and constantly seek opportunities to expand my knowledge and skills. My goal is to 
            push myself to grow and evolve personally and professionally while contributing meaningfully to the projects I take on.
          </Text>
          <Text style={[styles.paragraphText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
            I enjoy collaborating in dynamic environments where creative solutions are valued, and teamwork is key. 
            With a strong focus on continuous learning, I'm always ready to embrace new opportunities that allow me to 
            innovate, make a lasting impact, and grow as a professional. I believe in bringing my best self to every 
            challenge and am excited about the possibility of contributing to and growing with forward-thinking teams.
          </Text>
        </Section>
        
        <Section title="Skills">
          <Text style={[styles.subSectionTitle, { color: isDark ? '#38B000' : '#38B000' }]}>Soft Skills</Text>
          {skills.soft.map((skill, index) => (
            <ListItem 
              key={`soft-${index}`} 
              icon={<Briefcase size={16} color="#38B000" style={styles.listIcon} />} 
              text={skill} 
            />
          ))}
          
          <Text style={[styles.subSectionTitle, { color: isDark ? '#38B000' : '#38B000', marginTop: 15 }]}>Technical Skills</Text>
          {skills.technical.map((skill, index) => (
            <ListItem 
              key={`tech-${index}`} 
              icon={<Code size={16} color="#38B000" style={styles.listIcon} />} 
              text={skill} 
            />
          ))}
        </Section>
        
        <Section title="Projects">
          {projects.map((project, index) => (
            <View key={`project-${index}`} style={styles.projectItem}>
              <Text style={[styles.projectTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {project.title}
              </Text>
              <Text style={[styles.projectDescription, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                {project.description}
              </Text>
              <View style={styles.technologiesContainer}>
                <Cpu size={14} color="#38B000" />
                <Text style={[styles.technologiesText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                  {project.technologies}
                </Text>
              </View>
            </View>
          ))}
        </Section>
        
        <Section title="Research Papers">
          {researchPapers.map((paper, index) => (
            <View key={`paper-${index}`} style={styles.paperItem}>
              <Text style={[styles.paperTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                "{paper.title}"
              </Text>
              <Text style={[styles.paperDescription, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                {paper.description}
              </Text>
            </View>
          ))}
        </Section>
        
        <Section title="Awards & Certificates">
          <Text style={[styles.subSectionTitle, { color: isDark ? '#38B000' : '#38B000' }]}>Awards</Text>
          {awards.map((award, index) => (
            <ListItem 
              key={`award-${index}`} 
              icon={<Award size={16} color="#38B000" style={styles.listIcon} />} 
              text={award} 
            />
          ))}
          
          <Text style={[styles.subSectionTitle, { color: isDark ? '#38B000' : '#38B000', marginTop: 15 }]}>Certificates</Text>
          {certificates.map((cert, index) => (
            <ListItem 
              key={`cert-${index}`} 
              icon={<BookOpen size={16} color="#38B000" style={styles.listIcon} />} 
              text={cert} 
            />
          ))}
        </Section>
        
        <Section title="Languages & Interests">
          <Text style={[styles.subSectionTitle, { color: isDark ? '#38B000' : '#38B000' }]}>Languages</Text>
          <View style={styles.languagesContainer}>
            {languages.map((lang, index) => (
              <View key={`lang-${index}`} style={[styles.languageTag, { backgroundColor: isDark ? '#2A2A2A' : '#E8F5E9' }]}>
                <Languages size={12} color="#38B000" />
                <Text style={[styles.languageText, { color: isDark ? '#FFFFFF' : '#333333' }]}>{lang}</Text>
              </View>
            ))}
          </View>
          
          <Text style={[styles.subSectionTitle, { color: isDark ? '#38B000' : '#38B000', marginTop: 15 }]}>Interests</Text>
          {interests.map((interest, index) => (
            <ListItem 
              key={`interest-${index}`} 
              icon={<Bookmark size={16} color="#38B000" style={styles.listIcon} />} 
              text={interest} 
            />
          ))}
        </Section>
        
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
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileImageContainer: {
    marginVertical: 20,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInitials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactInfo: {
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
  },
  section: {
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  paragraphText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  listItemText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  educationItem: {
    marginBottom: 20,
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  institutionName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  degreeName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 3,
    marginLeft: 28,
  },
  periodText: {
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 28,
  },
  educationDetail: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 28,
    marginBottom: 3,
  },
  projectItem: {
    marginBottom: 20,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  technologiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  technologiesText: {
    fontSize: 14,
    marginLeft: 8,
  },
  paperItem: {
    marginBottom: 20,
  },
  paperTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  paperDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  languageText: {
    fontSize: 14,
    marginLeft: 5,
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