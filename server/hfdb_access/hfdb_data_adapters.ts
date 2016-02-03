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

  static fillContact(contact: any) : Contact {

    return {
      relation: contact.relation  || '',
      name:     contact.name      || '',
      address:  this.fillAddress(contact.address || {})
    }
  }

  static fillCall(call: any) : Call {
    return {
      assigned_to: call.assigned_to  || '',
      fm_number:   call.fm_number    || '',
      mail_sent:   call.mail_sent    || false,
      email_sent:  call.email_sent   || false,
      history:     call.history      || []
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
      updated_by: metadata.update_by  || ''
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
      alt_contact:   this.fillContact(data.alt_contact || {}),
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
      service_number: milService.service_number || '',
      dates:          milService.dates          || '',
      rank:           milService.rank           || '',
      branch:         milService.branch         || '',
      activity:       milService.activity       || ''
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
      _id:      data._id,
      _rev:     data._rev,
      general:  this.fillGeneral(data),
      guardian: this.fillPairedGuardian(data.guardian || {}),
      vet_type: data.vet_type,
      medical:  this.fillVeteranMedical(data.medical || {}),
      service:  this.fillMilService(data.service || {}),
      media_ok: data.media_ok,
      flight:   this.fillVeteranFlight(data.flight || {})
    }
  }

  static fillVeteranCallSheet(veteranDbDoc: VeteranDbDoc, data: any) : VeteranCallSheet {
    return {
      data:              veteranDbDoc,
      requestedGuradian: this.fillContact({}),
      isRemoved:         false
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

