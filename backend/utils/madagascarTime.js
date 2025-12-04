const moment = require('moment-timezone');

class MadagascarTime {
  // Heure actuelle à Madagascar (UTC+3)
  static now() {
    return moment().tz('Africa/Nairobi').toDate();
  }

  // Formater une date pour l'affichage
  static format(date, withSeconds = true) {
    if (!date) return 'Non disponible';
    
    try {
      const madagascarDate = moment(date).tz('Africa/Nairobi');
      
      if (withSeconds) {
        return madagascarDate.format('DD/MM/YYYY HH:mm:ss');
      } else {
        return madagascarDate.format('DD/MM/YYYY HH:mm');
      }
    } catch (error) {
      console.error('❌ Erreur formatage date:', error);
      return 'Date invalide';
    }
  }

  // Calculer "il y a X temps"
  static timeAgo(date) {
    if (!date) return 'inconnu';
    
    try {
      const madagascarDate = moment(date).tz('Africa/Nairobi');
      const now = moment().tz('Africa/Nairobi');
      
      const diffHours = now.diff(madagascarDate, 'hours');
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) {
        return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      } else if (diffHours > 0) {
        return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
      } else {
        const diffMinutes = now.diff(madagascarDate, 'minutes');
        if (diffMinutes > 0) {
          return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
        } else {
          return `à l'instant`;
        }
      }
    } catch (error) {
      console.error('❌ Erreur calcul timeAgo:', error);
      return 'inconnu';
    }
  }

  // Calculer "déjà passé" ou "dans X temps"
  static timeUntil(date) {
    if (!date) return 'inconnu';
    
    try {
      const madagascarDate = moment(date).tz('Africa/Nairobi');
      const now = moment().tz('Africa/Nairobi');
      
      const diffHours = madagascarDate.diff(now, 'hours');
      
      if (diffHours < 0) {
        return 'déjà passé';
      } else {
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays > 0) {
          return `dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        } else if (diffHours > 0) {
          return `dans ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
        } else {
          const diffMinutes = madagascarDate.diff(now, 'minutes');
          if (diffMinutes > 0) {
            return `dans ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
          } else {
            return 'bientôt';
          }
        }
      }
    } catch (error) {
      console.error('❌ Erreur calcul timeUntil:', error);
      return 'inconnu';
    }
  }
}

module.exports = MadagascarTime;