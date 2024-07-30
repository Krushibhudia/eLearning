import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    backgroundColor: '#f9f9f9',
  },
  certificate: {
    width: '100%',
    maxWidth: 700,  
    textAlign: 'center',
    border: '5px solid #4a90e2',
    borderRadius: 15,
    padding: 30,
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  logo: {
    width: 120,  
    height: 120,
  },
  title: {
    fontSize: 25,  
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    color: '#4a90e2',  
    whiteSpace: 'nowrap', 
  },
  subtitle: {
    fontSize: 22,  
    marginBottom: 15,
    color: '#666',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  name: {
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  course: {
    fontSize: 20,  
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#000',
  },
  footer: {
    marginTop: 30,
    fontSize: 14, 
    color: '#888',
  },
});

const CertificateTemplate = ({ userName, courseName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.certificate}>
        <View style={styles.logoContainer}>
          <Image 
            style={styles.logo} 
            src="https://static.vecteezy.com/system/resources/previews/000/586/123/original/book-reading-logo-and-symbols-template-icons-vector.jpg" 
          />
        </View>
        <Text style={styles.title}>Certificate of Completion</Text>
        <Text style={styles.subtitle}>This is to certify that</Text>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.subtitle}>has successfully completed the course</Text>
        <Text style={styles.course}>{courseName}</Text>
        <Text style={styles.footer}>Date of Completion: {new Date().toLocaleDateString()}</Text>
      </View>
    </Page>
  </Document>
);

export default CertificateTemplate;
