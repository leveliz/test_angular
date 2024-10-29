import { Component, ViewChild, OnInit } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MapService } from '../../map.server';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;


  branches: any[] = [];
  center: google.maps.LatLngLiteral = { lat: 15.8700, lng: 100.9925 }; // Center of Switzerland
  zoom = 6;
  markers: any[] = [];
  selectedBranch = <any | null>(null);

  constructor(private mapService: MapService) { }

  newLocation =
    new FormGroup({
      name: new FormControl('', Validators.required),
      latitude: new FormControl(null, Validators.required),
      longitude: new FormControl(null, Validators.required)
    });

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.mapService.getListLocation().subscribe(
      (data) => {
        console.log('API Response:', data);
        this.branches = data.resultData;
        this.markers = this.getMarkers();
      },
      (error) => {
        console.error('Error loading branches:', error);
      }
    );
  }

  addLocation(): void {
    if (this.newLocation.invalid) {
      alert('Please fill in all fields');
      return;
    }

    const locationData = this.newLocation.value;

    this.mapService.createLocation(locationData).subscribe(
      (response) => {
        console.log('Location added successfully:', response);
        alert('Location added successfully!');
        this.newLocation.reset();
        this.loadLocations();
      },
      (error) => {
        console.error('Error adding location:', error);
        alert('Failed to add location.');
      }
    );
  }


  getMarkers(): any[] {

    return this.branches.map((branch) => ({
      label: branch.name,
      position: { lat: branch.latitude, lng: branch.longitude },
      title: branch.name,
      options: { animation: google.maps.Animation.DROP },
      branch: branch,
    }));
  }

  openInfoWindow(branch: any, marker: MapMarker): void {
    this.selectedBranch = branch;
    this.infoWindow?.open(marker);
  }



}
