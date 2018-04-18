export default class People {
  static species = 'mammal'

  static destroy() {
    console.log('Everybody dies.')
  }

  married = false

  marriagePartner = null

  marry(anotherPeople) {
    this.married = true
    this.marriagePartner = anotherPeople
  }
}
