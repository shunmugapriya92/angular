import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-csvreader',
  templateUrl: './csvreader.component.html',
  styleUrls: ['./csvreader.component.scss']
})
export class CSVReaderComponent implements OnInit {
  _minimalIssue:number;
  filename:string='';
  get minimalIssue():number{
return this._minimalIssue;
  }
  set minimalIssue(value:number) {
this._minimalIssue = value;
this.filteredcsvRecords = this.minimalIssue ? this.performFilter(this.minimalIssue) : this.csvRecords;

console.log(this.filteredcsvRecords);
  }
  ngOnInit(): void {
    
  }
  public csvRecords: any[] = [];
  public templist: any[] = [];
  public filteredcsvRecords: any[] = [];

  @ViewChild('fileImportInput') fileImportInput: any;

  performFilter(filterBy: number): CSVRecord[] {
    
    this.templist = [];

    //filterBy = filterBy.toLocaleLowerCase(); 
    for (var i=0; i<this.csvRecords.length; i++) {
      console.log(this.csvRecords[i].issueCount);
      console.log(this.csvRecords[i].issueCount >= filterBy)
      if(this.csvRecords[i].issueCount>=filterBy){
        this.templist.push(this.csvRecords[i])
      }
      console.log(this.csvRecords[i])
    } 
    // return this.csvRecords.filter((record: CSVRecord) =>
    // record.issueCount>=filterBy);
    return this.templist;
  }
  fileChangeListener($event: any): void {

    
    var files = $event.srcElement.files;
    console.log('hi'+$event.target.value);
      this.filename = $event.srcElement.files[0].name;
    if (this.isCSVFile(files[0])) {
      
      var input = $event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (data) => {
        let csvData = reader.result;
        let csvRecordsArray = csvData.split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.filteredcsvRecords = this.csvRecords;
      }

      reader.onerror = function() {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    var dataArr = []

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = csvRecordsArray[i].split(',');

      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
      if (data.length == headerLength) {

        var csvRecord: CSVRecord = new CSVRecord();

        csvRecord.firstName = data[0].trim();
        csvRecord.surName = data[1].trim();
        csvRecord.issueCount = data[2].trim();
        csvRecord.dateOfBirth = data[3].trim();
        

        dataArr.push(csvRecord);
      }
    }
    return dataArr;
  }

  // CHECK IF FILE IS A VALID CSV FILE
  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  // GET CSV FILE HEADER COLUMNS
  getHeaderArray(csvRecordsArr: any) {
    let headers = csvRecordsArr[0].split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

}

export class CSVRecord{

  public firstName: any;
  public surName: any;
  public issueCount: number;
  public dateOfBirth: any;
  

  constructor()
  {

  }

  

}
