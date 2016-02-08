import {CallStatus} from 'collections/enums';

export class HFDataAdapters {

  static fillName(name: any) : Name {
    return {
      first:    name.first    || '',
      last:     name.last     || '',
      middle:   name.middle   || '',
      nickname: name.nickname || ''
    }
  }

  static fillAddress(address: any) : Address {
    return {
      street:    address.street    || '',
      city:      address.city      || '',
      county:    address.county    || '',
      state:     address.state     || '',
      zip:       address.zip       || '',
      phone_day: address.phone_day || '',
      phone_eve: address.phone_eve || '',
      phone_mbl: address.phone_mbl || '',
      email:     address.email     || ''
    }
  }

  static fillContactAddress(address: any) : ContactAddress {
    return {
      street:    address.street    || '',
      city:      address.city      || '',
      state:     address.state     || '',
      zip:       address.zip       || '',
      phone:     address.phone     || '',
      phone_eve: address.phone_eve || '',
      phone_mbl: address.phone_mbl || '',
      email:     address.email     || ''
    }
  }

  static fillContact(contact: any) : Contact {

    return {
      relation: contact.relation || '',
      name:     contact.name     || '',
      address:  this.fillContactAddress(contact.address || {})
    }
  }

  static fillCall(call: any) : Call {
    return {
      assigned_to: call.assigned_to || '',
      fm_number:   call.fm_number   || '',
      mail_sent:   call.mail_sent   || false,
      email_sent:  call.email_sent  || false,
      history:     call.history     || []
    }
  }

  static fillApparel(apparel: any) : Apparel {
    return {
      date:     apparel.date     || '',
      item:     apparel.item     || '',
      delivery: apparel.delivery || '',
      notes:    apparel.notes    || '',
      by:       apparel.by       || ''
    }
  }

  static fillMetadata(metadata: any) : Metadata {
    return {
      created_at: metadata.created_at || '',
      created_by: metadata.created_by || '',
      updated_at: metadata.updated_at || '',
      updated_by: metadata.updated_by || ''
    }
  }

  static fillGeneral(data: any) : General {
    return {
      app_date:      data.app_date,
      name:          this.fillName(data.name || {}),
      address:       this.fillAddress(data.address || {}),
      shirt:         { size: data.shirt.size },
      birth_date:    data.birth_date,
      weight:        data.weight,
      gender:        data.gender,
      emerg_contact: this.fillContact(data.emerg_contact || {}),
      call:          this.fillCall(data.call || {}),
      apparel:       this.fillApparel(data.apparel || {}),
      metadata:      this.fillMetadata(data.metadata || {})
    }
  }

  static fillPairedGuardian(pairedGuardian: any) : PairedGuardian {
    return {
      pref_notes: pairedGuardian.pref_notes  || '',
      id:         pairedGuardian.id          || '',
      name:       pairedGuardian.name        || '',
      history:    pairedGuardian.history     || []
    }
  }

  static fillVeteranMedical(medical: any) : VeteranMedical {
    return {
      limitations:       medical.limitations       || '',
      examRequired:      medical.examRequired      || false,
      level:             medical.level             || '',
      review:            medical.review            || '',
      usesWheelchair:    medical.usesWheelchair    || false,
      usesCane:          medical.usesCane          || false,
      usesWalker:        medical.usesWalker        || false,
      usesScooter:       medical.usesScooter       || false,
      requiresOxygen:    medical.requiresOxygen    || false,
      isWheelchairBound: medical.isWheelchairBound || false,
      release:           medical.release           || false,
    }
  }

  static fillMilService(milService: any) : MilService {
    return {
      dates:    milService.dates    || '',
      rank:     milService.rank     || '',
      branch:   milService.branch   || '',
      activity: milService.activity || ''
    }
  }

  static fillFlight(flight: any) : Flight {
    return {
      id:             flight.id             || '',
      status:         flight.status         || '',
      status_note:    flight.status_note    || '',
      confirmed_date: flight.confirmed_date || '',
      confirmed_by:   flight.confirmed_by   || '',
      seat:           flight.seat           || '',
      bus:            flight.bus            || '',
      waiver:         flight.waiver         || false,
      history:        flight.history        || []
    }
  }

  static fillVeteranFlight(flight: any) : VeteranFlight {
    return {
      flight: this.fillFlight(flight),
      group:  flight.group || ''
    }
  }

  static fillVeteranDbDoc(data: any) : VeteranDbDoc {
    return {
      _id:         data._id,
      _rev:        data._rev,
      general:     this.fillGeneral(data),
      guardian:    this.fillPairedGuardian(data.guardian || {}),
      vet_type:    data.vet_type,
      medical:     this.fillVeteranMedical(data.medical || {}),
      service:     this.fillMilService(data.service || {}),
      alt_contact: this.fillContact(data.alt_contact || {}),
      mail_call:   this.fillContact(data.mail_call || {}),
      media_ok:    data.media_ok,
      flight:      this.fillVeteranFlight(data.flight || {})
    }
  }

  static fillVeteranCallSheet(veteranDbDoc: VeteranDbDoc, data: any) : VeteranCallSheet {
    return {
      data:              veteranDbDoc,
      requestedGuardian: this.fillContact({}),
      isRemoved:         false
    }
  }

  static fillGuardianFlight(flight: any) : GuardianFlight {
    return {
      flight:            this.fillFlight(flight),
      training:          flight.training          || '',
      training_notes:    flight.training_notes    || '',
      training_complete: flight.training_complete || false,
      paid:              flight.paid              || false,
      booksOrdered:      flight.booksOrdered      || 0
    }
  }

  static fillPairedVeterans(pairedVeterans: any) : PairedVeterans {
    return {
      pref_notes: pairedVeterans.pref_notes || '',
      pairings:   pairedVeterans.pairings   || [],
      history:    pairedVeterans.history    || []
    }
  }

  static fillGuardianMedical(guardianMedical: any) : GuardianMedical {
    return {
      limitations: guardianMedical.limitations || '',
      experience:  guardianMedical.experience  || '',
      release:     guardianMedical.release     || false
    }
  }

  static fillGuardianNotes(guardianNotes: any) : GuardianNotes {
    return {
      other:   guardianNotes.other   || '',
      service: guardianNotes.service || ''
    }
  }

  static fillGuardianDbDoc(data: any) : GuardianDbDoc {
    return {
      _id:        data._id,
      _rev:       data._rev,
      general:    this.fillGeneral(data),
      veteran:   this.fillPairedVeterans(data.veteran || {}),
      occupation: data.occupation || '',
      medical:    this.fillGuardianMedical(data.medical || {}),
      notes:      this.fillGuardianNotes(data.notes || {}),
      flight:     this.fillGuardianFlight(data.flight || {})
    }
  }

  static fillGuardianCallSheet(guardianDbDoc: GuardianDbDoc, data: any) : GuardianCallSheet {
    return {
      data:            guardianDbDoc,
      understandsFee:  false,
      acceptsMailCall: false,
      isRemoved:       false
    }
  }

  static fillVetPacketData(packet: CallPacket, vetData: any) : CallPacket {
    packet.veteranCallSheetId = vetData._id;
    packet.veteranDbId = vetData._id;
    packet.veteranName = vetData.name.first + ' ' + vetData.name.last;
    packet.veteranStatus = CallStatus.New;

    return packet;
  }

  static fillGrdPacketData(packet: CallPacket, grdData: any) : CallPacket {
    packet.guardianCallSheetId = grdData._id;
    packet.guardianDbId = grdData._id;
    packet.guardianName = grdData.name.first + ' ' + grdData.name.last;
    packet.guardianStatus = CallStatus.New;

    return packet;
  }

}

