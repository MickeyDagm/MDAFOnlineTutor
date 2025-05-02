// User roles
const UserRole = {
  STUDENT: 'student',
  TUTOR: 'tutor',
};

// User interface
class User {
  constructor(id, name, email, role, createdAt, avatarUrl = null) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.avatarUrl = avatarUrl;
    this.createdAt = new Date(createdAt);
  }
}

// Student interface
class Student extends User {
  constructor(id, name, email, academicLevel, subjects, preferredLanguage, createdAt, department = null, pricePerHour = null, avatarUrl = null) {
    super(id, name, email, UserRole.STUDENT, createdAt, avatarUrl);
    this.academicLevel = academicLevel;
    this.subjects = subjects;
    this.department = department;
    this.preferredLanguage = preferredLanguage;
    this.pricePerHour = pricePerHour;
  }
}

// Tutor interface
class Tutor extends User {
  constructor(id, name, email, yearsOfExperience, gender, subjects, pricePerHour, specialties, availability, rating, bio, totalSessions, totalStudents, createdAt, avatarUrl = null) {
    super(id, name, email, UserRole.TUTOR, createdAt, avatarUrl);
    this.yearsOfExperience = yearsOfExperience;
    this.gender = gender;
    this.subjects = subjects;
    this.pricePerHour = pricePerHour;
    this.specialties = specialties;
    this.availability = availability;
    this.rating = rating;
    this.bio = bio;
    this.totalSessions = totalSessions;
    this.totalStudents = totalStudents;
  }
}

// Availability interface
class Availability {
  constructor(day, startTime, endTime) {
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

// Session interface
class Session {
  constructor(id, tutorId, studentId, subject, startTime, endTime, status, paymentStatus, notes = null, rating = null, review = null) {
    this.id = id;
    this.tutorId = tutorId;
    this.studentId = studentId;
    this.subject = subject;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
    this.status = status;
    this.paymentStatus = paymentStatus;
    this.notes = notes;
    this.rating = rating;
    this.review = review;
  }
}

// Payment interface
class Payment {
  constructor(id, sessionId, amount, platformFee, tutorEarnings, status, paymentMethod, paymentDate) {
    this.id = id;
    this.sessionId = sessionId;
    this.amount = amount;
    this.platformFee = platformFee;
    this.tutorEarnings = tutorEarnings;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.paymentDate = new Date(paymentDate);
  }
}

// Notification interface
class Notification {
  constructor(id, userId, title, message, isRead, createdAt, link = null) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.message = message;
    this.isRead = isRead;
    this.createdAt = new Date(createdAt);
    this.link = link;
  }
}

// Academic level option interface
const AcademicLevelOption = {
  value: '',
  label: '',
};

// Subject option interface
const SubjectOption = {
  value: '',
  label: '',
  department: null,
};

// Auth context type
const AuthContextType = {
  user: null,
  login: async (email, password) => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: false,
};
